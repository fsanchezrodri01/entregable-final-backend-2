import { ticketsRepository } from '../repositories/tickets.repository.js';
import { eventsRepository } from '../repositories/events.repository.js';
import { badRequest, conflict, forbidden, notFound } from '../utils/httpError.js';
import { generateReservationCode } from '../utils/reservationCode.js';
import { isPositiveInteger, isValidObjectId } from '../utils/validators.js';
import { sendTicketConfirmationEmail, sendTicketCancellationEmail } from './mail.service.js';

class TicketsService {
  constructor(repository, eventsRepo) {
    this.repository = repository;
    this.eventsRepository = eventsRepo;
  }

  // Cupo disponible = capacidad menos los lugares de inscripciones no canceladas.
  async getAvailability(event) {
    const reserved = await this.repository.getReservedQuantity(event._id);
    return { reserved, available: event.capacity - reserved };
  }

  async create({ eventId, quantity = 1 }, requester) {
    if (!isValidObjectId(eventId)) {
      throw badRequest('El id de curso no es valido');
    }

    if (!isPositiveInteger(quantity)) {
      throw badRequest('La cantidad debe ser un numero entero mayor a cero');
    }

    const event = await this.eventsRepository.getRawById(eventId);

    if (!event) {
      throw notFound('Curso no encontrado');
    }

    if (event.status !== 'published') {
      throw badRequest('El curso no esta disponible para inscripciones');
    }

    if (event.date <= new Date()) {
      throw badRequest('No es posible inscribirse a un curso finalizado');
    }

    const existing = await this.repository.getActiveByUserAndEvent(requester.id, event._id);

    if (existing) {
      throw conflict('Ya tienes una inscripcion activa a este curso');
    }

    const { available } = await this.getAvailability(event);

    if (Number(quantity) > available) {
      throw conflict(`No hay cupos suficientes disponibles (quedan ${available})`);
    }

    const ticket = await this.repository.create({
      user: requester.id,
      event: event._id,
      quantity: Number(quantity),
      reservationCode: generateReservationCode(),
      status: 'confirmed'
    });

    // El correo es una notificacion posterior: si falla, la inscripcion sigue siendo valida.
    await sendTicketConfirmationEmail({
      to: requester.email,
      userName: requester.first_name,
      eventTitle: event.title,
      eventDate: event.date,
      reservationCode: ticket.reservationCode,
      quantity: ticket.quantity
    });

    return this.repository.getById(ticket.id);
  }

  listMine(requester) {
    return this.repository.listByUser(requester.id);
  }

  async listByEvent(eventId, requester) {
    if (!isValidObjectId(eventId)) {
      throw badRequest('El id de curso no es valido');
    }

    const event = await this.eventsRepository.getRawById(eventId);

    if (!event) {
      throw notFound('Curso no encontrado');
    }

    if (requester.role !== 'admin' && event.organizer.toString() !== requester.id) {
      throw forbidden('No tienes permisos para consultar las inscripciones de este curso');
    }

    return this.repository.listByEvent(event._id);
  }

  async cancel(ticketId, requester) {
    if (!isValidObjectId(ticketId)) {
      throw badRequest('El id de inscripcion no es valido');
    }

    const ticket = await this.repository.getById(ticketId);

    if (!ticket) {
      throw notFound('Inscripcion no encontrada');
    }

    if (requester.role !== 'admin' && ticket.user.toString() !== requester.id) {
      throw forbidden('No tienes permisos para cancelar esta inscripcion');
    }

    if (ticket.status === 'cancelled') {
      throw badRequest('La inscripcion ya esta cancelada');
    }

    if (ticket.event.date <= new Date()) {
      throw badRequest('No se puede cancelar una inscripcion de un curso finalizado');
    }

    ticket.status = 'cancelled';
    ticket.cancelledAt = new Date();
    await this.repository.save(ticket);

    await sendTicketCancellationEmail({
      to: requester.email,
      userName: requester.first_name,
      eventTitle: ticket.event.title,
      reservationCode: ticket.reservationCode
    });

    return ticket;
  }
}

export const ticketsService = new TicketsService(ticketsRepository, eventsRepository);
export default ticketsService;

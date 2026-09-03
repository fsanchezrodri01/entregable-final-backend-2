import { eventsRepository } from '../repositories/events.repository.js';
import { categoriesRepository } from '../repositories/categories.repository.js';
import { ticketsRepository } from '../repositories/tickets.repository.js';
import { badRequest, forbidden, notFound } from '../utils/httpError.js';
import { buildPagination } from '../utils/pagination.js';
import { isValidDate, isValidObjectId } from '../utils/validators.js';
import { EVENT_FORMATS, EVENT_LEVELS, EVENT_STATUSES, PUBLIC_EVENT_STATUSES } from '../config/constants.js';

const ALLOWED_SORT = ['date', '-date', 'price', '-price', 'title', '-title', 'createdAt', '-createdAt'];

class EventsService {
  constructor(repository, categoriesRepo, ticketsRepo) {
    this.repository = repository;
    this.categoriesRepository = categoriesRepo;
    this.ticketsRepository = ticketsRepo;
  }

  // Un usuario comun solo ve cursos publicados o finalizados; el organizador suma los propios.
  buildVisibilityFilter(requester, requestedStatus) {
    if (requester?.role === 'admin') {
      return requestedStatus ? { status: requestedStatus } : {};
    }

    if (requester?.role === 'organizer') {
      const visible = { $or: [{ status: { $in: PUBLIC_EVENT_STATUSES } }, { organizer: requester.id }] };
      return requestedStatus ? { $and: [visible, { status: requestedStatus }] } : visible;
    }

    if (requestedStatus && !PUBLIC_EVENT_STATUSES.includes(requestedStatus)) {
      throw forbidden('No tienes permisos para consultar cursos en ese estado');
    }

    return { status: requestedStatus || { $in: PUBLIC_EVENT_STATUSES } };
  }

  async list(query = {}, requester = null) {
    const {
      category, status, location, fromDate, toDate, organizer, level, format, search,
      minPrice, maxPrice, page, limit, sort = 'date'
    } = query;

    if (status && !EVENT_STATUSES.includes(status)) {
      throw badRequest(`El estado debe ser uno de: ${EVENT_STATUSES.join(', ')}`);
    }

    const filter = this.buildVisibilityFilter(requester, status);

    if (category) {
      if (!isValidObjectId(category)) {
        throw badRequest('El id de categoria no es valido');
      }
      filter.category = category;
    }

    if (organizer) {
      if (!isValidObjectId(organizer)) {
        throw badRequest('El id de organizador no es valido');
      }
      filter.organizer = organizer;
    }

    if (level) {
      filter.level = level;
    }

    if (format) {
      filter.format = format;
    }

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    if (fromDate || toDate) {
      filter.date = {};

      if (fromDate) {
        if (!isValidDate(fromDate)) throw badRequest('fromDate no es una fecha valida');
        filter.date.$gte = new Date(fromDate);
      }

      if (toDate) {
        if (!isValidDate(toDate)) throw badRequest('toDate no es una fecha valida');
        filter.date.$lte = new Date(toDate);
      }
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOption = ALLOWED_SORT.includes(sort) ? sort : 'date';
    const { pageNumber, limitNumber, skip } = buildPagination({ page, limit });

    const [events, total] = await Promise.all([
      this.repository.list(filter, { skip, limit: limitNumber, sort: sortOption }),
      this.repository.count(filter)
    ]);

    return { events, total, pageNumber, limitNumber };
  }

  async getById(id) {
    if (!isValidObjectId(id)) {
      throw badRequest('El id de curso no es valido');
    }

    const event = await this.repository.getById(id);

    if (!event) {
      throw notFound('Curso no encontrado');
    }

    return event;
  }

  async create(data, requester) {
    const {
      title, description, category, date, location, capacity,
      price = 0, status = 'draft', level = 'beginner', format = 'curso'
    } = data;

    if (!title || !description || !category || !date || !location || capacity === undefined) {
      throw badRequest('Faltan campos obligatorios');
    }

    if (!isValidObjectId(category)) {
      throw badRequest('El id de categoria no es valido');
    }

    if (!(await this.categoriesRepository.getById(category))) {
      throw notFound('Categoria no encontrada');
    }

    if (!isValidDate(date)) {
      throw badRequest('La fecha no es valida');
    }

    if (new Date(date) <= new Date()) {
      throw badRequest('No se puede crear un curso con fecha pasada');
    }

    if (Number(capacity) <= 0) {
      throw badRequest('La capacidad debe ser mayor a cero');
    }

    if (Number(price) < 0) {
      throw badRequest('El precio no puede ser negativo');
    }

    if (!EVENT_STATUSES.includes(status)) {
      throw badRequest(`El estado debe ser uno de: ${EVENT_STATUSES.join(', ')}`);
    }

    if (!EVENT_LEVELS.includes(level)) {
      throw badRequest(`El nivel debe ser uno de: ${EVENT_LEVELS.join(', ')}`);
    }

    if (!EVENT_FORMATS.includes(format)) {
      throw badRequest(`El formato debe ser uno de: ${EVENT_FORMATS.join(', ')}`);
    }

    const created = await this.repository.create({
      title,
      description,
      category,
      date,
      location,
      level,
      format,
      capacity: Number(capacity),
      price: Number(price),
      status,
      organizer: requester.id
    });

    return this.repository.getById(created.id);
  }

  // Devuelve el curso solo si el solicitante es su organizador o un admin.
  async getOwnedEvent(eventId, requester) {
    const event = await this.getById(eventId);
    const organizerId = event.organizer?._id?.toString() ?? event.organizer?.toString();

    if (requester.role !== 'admin' && organizerId !== requester.id) {
      throw forbidden('No tienes permisos para gestionar este curso');
    }

    return event;
  }

  async update(eventId, data, requester) {
    const event = await this.getOwnedEvent(eventId, requester);

    if (event.status === 'finished') {
      throw badRequest('No se puede modificar un curso finalizado');
    }

    if (event.status === 'cancelled' && requester.role !== 'admin') {
      throw badRequest('No se puede modificar un curso cancelado');
    }

    const { title, description, category, date, location, capacity, price, level, format } = data;
    const updates = {};

    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (location !== undefined) updates.location = location;

    if (category !== undefined) {
      if (!isValidObjectId(category)) {
        throw badRequest('El id de categoria no es valido');
      }
      if (!(await this.categoriesRepository.getById(category))) {
        throw notFound('Categoria no encontrada');
      }
      updates.category = category;
    }

    if (date !== undefined) {
      if (!isValidDate(date)) {
        throw badRequest('La fecha no es valida');
      }
      if (new Date(date) <= new Date()) {
        throw badRequest('No se puede mover un curso a una fecha pasada');
      }
      updates.date = date;
    }

    if (capacity !== undefined) {
      if (Number(capacity) <= 0) {
        throw badRequest('La capacidad debe ser mayor a cero');
      }

      const reserved = await this.ticketsRepository.getReservedQuantity(event._id);

      if (Number(capacity) < reserved) {
        throw badRequest(`La capacidad no puede ser menor a las inscripciones activas (${reserved})`);
      }

      updates.capacity = Number(capacity);
    }

    if (price !== undefined) {
      if (Number(price) < 0) {
        throw badRequest('El precio no puede ser negativo');
      }
      updates.price = Number(price);
    }

    if (level !== undefined) {
      if (!EVENT_LEVELS.includes(level)) {
        throw badRequest(`El nivel debe ser uno de: ${EVENT_LEVELS.join(', ')}`);
      }
      updates.level = level;
    }

    if (format !== undefined) {
      if (!EVENT_FORMATS.includes(format)) {
        throw badRequest(`El formato debe ser uno de: ${EVENT_FORMATS.join(', ')}`);
      }
      updates.format = format;
    }

    return this.repository.update(eventId, updates);
  }

  async changeStatus(eventId, status, requester) {
    if (!EVENT_STATUSES.includes(status)) {
      throw badRequest(`El estado debe ser uno de: ${EVENT_STATUSES.join(', ')}`);
    }

    const event = await this.getOwnedEvent(eventId, requester);

    if (event.status === 'finished') {
      throw badRequest('No se puede modificar un curso finalizado');
    }

    if (status === 'cancelled') {
      if (event.date <= new Date()) {
        throw badRequest('No se puede cancelar un curso que ya finalizo');
      }

      // Al cancelar el curso, sus inscripciones activas dejan de serlo.
      await this.ticketsRepository.cancelAllByEvent(event._id);
    }

    if (status === 'published' && event.date <= new Date()) {
      throw badRequest('No se puede publicar un curso con fecha pasada');
    }

    return this.repository.update(eventId, { status });
  }

  // Cierra los cursos publicados cuya fecha ya paso.
  finishPastEvents() {
    return this.repository.finishPastEvents();
  }
}

export const eventsService = new EventsService(eventsRepository, categoriesRepository, ticketsRepository);
export default eventsService;

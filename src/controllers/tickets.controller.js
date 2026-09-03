import { ticketsService } from '../services/tickets.service.js';
import { TicketDTO } from '../dto/ticket.dto.js';

export const createTicket = async (req, res, next) => {
  try {
    const ticket = await ticketsService.create(
      { eventId: req.params.eid, quantity: req.body.quantity },
      req.user
    );

    res.status(201).json({
      status: 'success',
      message: 'Inscripcion realizada correctamente',
      payload: new TicketDTO(ticket)
    });
  } catch (error) {
    next(error);
  }
};

export const getMyTickets = async (req, res, next) => {
  try {
    const tickets = await ticketsService.listMine(req.user);
    res.status(200).json({ status: 'success', payload: TicketDTO.fromList(tickets) });
  } catch (error) {
    next(error);
  }
};

export const getEventTickets = async (req, res, next) => {
  try {
    const tickets = await ticketsService.listByEvent(req.params.eid, req.user);
    res.status(200).json({ status: 'success', payload: TicketDTO.fromList(tickets) });
  } catch (error) {
    next(error);
  }
};

export const cancelTicket = async (req, res, next) => {
  try {
    const ticket = await ticketsService.cancel(req.params.tid, req.user);

    res.status(200).json({
      status: 'success',
      message: 'Inscripcion cancelada correctamente',
      payload: new TicketDTO(ticket)
    });
  } catch (error) {
    next(error);
  }
};

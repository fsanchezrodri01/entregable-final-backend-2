import { ticketsDao } from '../dao/tickets.dao.js';

class TicketsRepository {
  constructor(dao) {
    this.dao = dao;
  }

  create(data) {
    return this.dao.create(data);
  }

  getById(id) {
    return this.dao.findById(id);
  }

  listByUser(userId) {
    return this.dao.findByUser(userId);
  }

  listByEvent(eventId) {
    return this.dao.findByEvent(eventId);
  }

  getActiveByUserAndEvent(userId, eventId) {
    return this.dao.findActiveByUserAndEvent(userId, eventId);
  }

  getReservedQuantity(eventId) {
    return this.dao.sumActiveQuantityByEvent(eventId);
  }

  save(ticket) {
    return this.dao.save(ticket);
  }

  cancelAllByEvent(eventId) {
    return this.dao.cancelActiveByEvent(eventId);
  }
}

export const ticketsRepository = new TicketsRepository(ticketsDao);
export default ticketsRepository;

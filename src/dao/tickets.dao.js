import { TicketModel } from '../models/Ticket.js';
import { ACTIVE_TICKET_STATUSES } from '../config/constants.js';

const EVENT_FIELDS = 'title date location status format level';
const USER_FIELDS = 'first_name last_name email';

class TicketsDao {
  create(data) {
    return TicketModel.create(data);
  }

  findById(id) {
    return TicketModel.findById(id).populate('event', EVENT_FIELDS);
  }

  findByUser(userId) {
    return TicketModel.find({ user: userId }).populate('event', EVENT_FIELDS).sort('-createdAt');
  }

  findByEvent(eventId) {
    return TicketModel.find({ event: eventId })
      .populate('user', USER_FIELDS)
      .populate('event', EVENT_FIELDS)
      .sort('-createdAt');
  }

  findActiveByUserAndEvent(userId, eventId) {
    return TicketModel.findOne({
      user: userId,
      event: eventId,
      status: { $in: ACTIVE_TICKET_STATUSES }
    });
  }

  async sumActiveQuantityByEvent(eventId) {
    const [result] = await TicketModel.aggregate([
      { $match: { event: eventId, status: { $in: ACTIVE_TICKET_STATUSES } } },
      { $group: { _id: '$event', totalReserved: { $sum: '$quantity' } } }
    ]);

    return result?.totalReserved || 0;
  }

  save(ticket) {
    return ticket.save();
  }

  cancelActiveByEvent(eventId) {
    return TicketModel.updateMany(
      { event: eventId, status: { $in: ACTIVE_TICKET_STATUSES } },
      { status: 'cancelled', cancelledAt: new Date() }
    );
  }
}

export const ticketsDao = new TicketsDao();
export default ticketsDao;

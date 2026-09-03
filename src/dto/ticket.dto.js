import { UserDTO } from './user.dto.js';
import { EventDTO } from './event.dto.js';

// Un ObjectId sin popular tambien es un objeto: se distingue por su marca de BSON.
const isPopulated = value =>
  value && typeof value === 'object' && !Array.isArray(value) && value._bsontype !== 'ObjectId';

export class TicketDTO {
  constructor(ticket) {
    this.id = ticket._id?.toString() ?? ticket.id;
    this.event = isPopulated(ticket.event) ? new EventDTO(ticket.event) : ticket.event?.toString();
    this.user = isPopulated(ticket.user) ? new UserDTO(ticket.user) : ticket.user?.toString();
    this.quantity = ticket.quantity;
    this.status = ticket.status;
    this.reservationCode = ticket.reservationCode;
    this.createdAt = ticket.createdAt;
    this.cancelledAt = ticket.cancelledAt;
  }

  static fromList(tickets = []) {
    return tickets.map(ticket => new TicketDTO(ticket));
  }
}

export default TicketDTO;

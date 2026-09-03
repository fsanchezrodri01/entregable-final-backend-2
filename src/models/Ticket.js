import mongoose from 'mongoose';
import { TICKET_STATUSES } from '../config/constants.js';

const ticketSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    status: { type: String, enum: TICKET_STATUSES, default: 'confirmed' },
    quantity: { type: Number, required: true, min: 1 },
    reservationCode: { type: String, required: true, unique: true, uppercase: true, trim: true },
    cancelledAt: { type: Date, default: null }
  },
  { timestamps: true }
);

ticketSchema.index({ event: 1, status: 1 });
ticketSchema.index({ user: 1, event: 1, status: 1 });

export const TicketModel = mongoose.model('Ticket', ticketSchema);
export default TicketModel;

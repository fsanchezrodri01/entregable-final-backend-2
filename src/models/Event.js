import mongoose from 'mongoose';
import { EVENT_FORMATS, EVENT_LEVELS, EVENT_STATUSES } from '../config/constants.js';

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    format: { type: String, enum: EVENT_FORMATS, default: 'curso' },
    level: { type: String, enum: EVENT_LEVELS, default: 'beginner' },
    date: { type: Date, required: true },
    location: { type: String, required: true, trim: true },
    capacity: { type: Number, required: true, min: 1 },
    price: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: EVENT_STATUSES, default: 'draft' },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

eventSchema.index({ status: 1, date: 1 });

export const EventModel = mongoose.model('Event', eventSchema);
export default EventModel;

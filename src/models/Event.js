import mongoose from 'mongoose';

const eventCollection = 'events';

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    capacity: { type: Number, required: true, min: 1 },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }
  },
  { timestamps: true }
);

export const Event = mongoose.model(eventCollection, eventSchema);
export default Event;

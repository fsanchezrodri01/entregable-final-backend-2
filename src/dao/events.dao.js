import { EventModel } from '../models/Event.js';

const ORGANIZER_FIELDS = 'first_name last_name email';

class EventsDao {
  create(data) {
    return EventModel.create(data);
  }

  findById(id) {
    return EventModel.findById(id).populate('category').populate('organizer', ORGANIZER_FIELDS);
  }

  findRawById(id) {
    return EventModel.findById(id);
  }

  findAll(filter = {}, { skip = 0, limit = 10, sort = 'date' } = {}) {
    return EventModel.find(filter)
      .populate('category')
      .populate('organizer', ORGANIZER_FIELDS)
      .sort(sort)
      .skip(skip)
      .limit(limit);
  }

  count(filter = {}) {
    return EventModel.countDocuments(filter);
  }

  updateById(id, data) {
    return EventModel.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate('category')
      .populate('organizer', ORGANIZER_FIELDS);
  }

  countByCategory(categoryId) {
    return EventModel.countDocuments({ category: categoryId });
  }

  finishPastEvents() {
    return EventModel.updateMany(
      { date: { $lt: new Date() }, status: 'published' },
      { status: 'finished' }
    );
  }
}

export const eventsDao = new EventsDao();
export default eventsDao;

import { eventsDao } from '../dao/events.dao.js';

class EventsRepository {
  constructor(dao) {
    this.dao = dao;
  }

  create(data) {
    return this.dao.create(data);
  }

  getById(id) {
    return this.dao.findById(id);
  }

  getRawById(id) {
    return this.dao.findRawById(id);
  }

  list(filter, options) {
    return this.dao.findAll(filter, options);
  }

  count(filter) {
    return this.dao.count(filter);
  }

  update(id, data) {
    return this.dao.updateById(id, data);
  }

  countByCategory(categoryId) {
    return this.dao.countByCategory(categoryId);
  }

  finishPastEvents() {
    return this.dao.finishPastEvents();
  }
}

export const eventsRepository = new EventsRepository(eventsDao);
export default eventsRepository;

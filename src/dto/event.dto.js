import { UserDTO } from './user.dto.js';
import { CategoryDTO } from './category.dto.js';

// Un ObjectId sin popular tambien es un objeto: se distingue por su marca de BSON.
const isPopulated = value =>
  value && typeof value === 'object' && !Array.isArray(value) && value._bsontype !== 'ObjectId';

export class EventDTO {
  constructor(event) {
    this.id = event._id?.toString() ?? event.id;
    this.title = event.title;
    this.description = event.description;
    this.category = isPopulated(event.category)
      ? new CategoryDTO(event.category)
      : event.category?.toString();
    this.format = event.format;
    this.level = event.level;
    this.date = event.date;
    this.location = event.location;
    this.capacity = event.capacity;
    this.price = event.price;
    this.status = event.status;
    this.organizer = isPopulated(event.organizer)
      ? new UserDTO(event.organizer)
      : event.organizer?.toString();
  }

  static fromList(events = []) {
    return events.map(event => new EventDTO(event));
  }
}

export default EventDTO;

import { usersRepository } from '../repositories/users.repository.js';

class SessionsService {
  constructor(repository) {
    this.repository = repository;
  }

  getCurrent() {
    return this.repository.getCurrent();
  }
}

export const sessionsService = new SessionsService(usersRepository);
export default sessionsService;

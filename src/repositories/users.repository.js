import { usersDao } from '../dao/users.dao.js';

class UsersRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getCurrent() {
    return this.dao.getCurrent();
  }
}

export const usersRepository = new UsersRepository(usersDao);
export default usersRepository;

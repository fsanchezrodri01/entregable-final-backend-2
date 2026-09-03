import { usersDao } from '../dao/users.dao.js';

class UsersRepository {
  constructor(dao) {
    this.dao = dao;
  }

  create(data) {
    return this.dao.create(data);
  }

  getById(id) {
    return this.dao.findById(id);
  }

  getByEmail(email) {
    return this.dao.findByEmail(email);
  }

  list(filter, options) {
    return this.dao.findAll(filter, options);
  }

  count(filter) {
    return this.dao.count(filter);
  }

  updateRole(id, role) {
    return this.dao.updateById(id, { role });
  }
}

export const usersRepository = new UsersRepository(usersDao);
export default usersRepository;

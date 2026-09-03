import { usersRepository } from '../repositories/users.repository.js';
import { badRequest, notFound } from '../utils/httpError.js';
import { buildPagination } from '../utils/pagination.js';
import { isValidObjectId } from '../utils/validators.js';
import { USER_ROLES } from '../config/constants.js';

class UsersService {
  constructor(repository) {
    this.repository = repository;
  }

  async list({ role, page, limit } = {}) {
    const filter = {};

    if (role) {
      if (!USER_ROLES.includes(role)) {
        throw badRequest(`El rol debe ser uno de: ${USER_ROLES.join(', ')}`);
      }
      filter.role = role;
    }

    const { pageNumber, limitNumber, skip } = buildPagination({ page, limit });
    const [users, total] = await Promise.all([
      this.repository.list(filter, { skip, limit: limitNumber }),
      this.repository.count(filter)
    ]);

    return { users, total, pageNumber, limitNumber };
  }

  async changeRole(userId, role) {
    if (!isValidObjectId(userId)) {
      throw badRequest('El id de usuario no es valido');
    }

    if (!USER_ROLES.includes(role)) {
      throw badRequest(`El rol debe ser uno de: ${USER_ROLES.join(', ')}`);
    }

    const user = await this.repository.updateRole(userId, role);

    if (!user) {
      throw notFound('Usuario no encontrado');
    }

    return user;
  }
}

export const usersService = new UsersService(usersRepository);
export default usersService;

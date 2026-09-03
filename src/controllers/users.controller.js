import { usersService } from '../services/users.service.js';
import { UserDTO } from '../dto/user.dto.js';
import { buildPagedResponse } from '../utils/pagination.js';

export const getUsers = async (req, res, next) => {
  try {
    const { users, total, pageNumber, limitNumber } = await usersService.list(req.query);

    res.status(200).json(
      buildPagedResponse({ data: UserDTO.fromList(users), total, pageNumber, limitNumber })
    );
  } catch (error) {
    next(error);
  }
};

export const changeUserRole = async (req, res, next) => {
  try {
    const user = await usersService.changeRole(req.params.uid, req.body.role);
    res.status(200).json({ status: 'success', payload: new UserDTO(user) });
  } catch (error) {
    next(error);
  }
};

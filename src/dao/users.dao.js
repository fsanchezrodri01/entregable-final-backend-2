import { UserModel } from '../models/User.js';

class UsersDao {
  create(data) {
    return UserModel.create(data);
  }

  findById(id) {
    return UserModel.findById(id);
  }

  findByEmail(email) {
    return UserModel.findOne({ email });
  }

  findAll(filter = {}, { skip = 0, limit = 10, sort = '-createdAt' } = {}) {
    return UserModel.find(filter).sort(sort).skip(skip).limit(limit);
  }

  count(filter = {}) {
    return UserModel.countDocuments(filter);
  }

  updateById(id, data) {
    return UserModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }
}

export const usersDao = new UsersDao();
export default usersDao;

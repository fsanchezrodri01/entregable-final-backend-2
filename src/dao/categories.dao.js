import { CategoryModel } from '../models/Category.js';

class CategoriesDao {
  create(data) {
    return CategoryModel.create(data);
  }

  findById(id) {
    return CategoryModel.findById(id);
  }

  findBySlug(slug) {
    return CategoryModel.findOne({ slug });
  }

  findAll(filter = {}) {
    return CategoryModel.find(filter).sort('name');
  }

  updateById(id, data) {
    return CategoryModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  deleteById(id) {
    return CategoryModel.findByIdAndDelete(id);
  }
}

export const categoriesDao = new CategoriesDao();
export default categoriesDao;

import { categoriesDao } from '../dao/categories.dao.js';

class CategoriesRepository {
  constructor(dao) {
    this.dao = dao;
  }

  create(data) {
    return this.dao.create(data);
  }

  getById(id) {
    return this.dao.findById(id);
  }

  getBySlug(slug) {
    return this.dao.findBySlug(slug);
  }

  list(filter) {
    return this.dao.findAll(filter);
  }

  update(id, data) {
    return this.dao.updateById(id, data);
  }

  remove(id) {
    return this.dao.deleteById(id);
  }
}

export const categoriesRepository = new CategoriesRepository(categoriesDao);
export default categoriesRepository;

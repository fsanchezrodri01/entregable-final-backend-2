import { categoriesRepository } from '../repositories/categories.repository.js';
import { eventsRepository } from '../repositories/events.repository.js';
import { badRequest, conflict, notFound } from '../utils/httpError.js';
import { isValidObjectId } from '../utils/validators.js';

const slugify = value =>
  String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

class CategoriesService {
  constructor(repository, eventsRepo) {
    this.repository = repository;
    this.eventsRepository = eventsRepo;
  }

  list() {
    return this.repository.list();
  }

  async getById(id) {
    if (!isValidObjectId(id)) {
      throw badRequest('El id de categoria no es valido');
    }

    const category = await this.repository.getById(id);

    if (!category) {
      throw notFound('Categoria no encontrada');
    }

    return category;
  }

  async create({ name, description = '' }) {
    if (!name) {
      throw badRequest('El nombre de la categoria es obligatorio');
    }

    const slug = slugify(name);

    if (await this.repository.getBySlug(slug)) {
      throw conflict('Ya existe una categoria con ese nombre');
    }

    return this.repository.create({ name: String(name).trim(), slug, description });
  }

  async update(id, { name, description }) {
    const category = await this.getById(id);
    const data = {};

    if (name) {
      const slug = slugify(name);
      const existing = await this.repository.getBySlug(slug);

      if (existing && existing.id !== category.id) {
        throw conflict('Ya existe una categoria con ese nombre');
      }

      data.name = String(name).trim();
      data.slug = slug;
    }

    if (description !== undefined) {
      data.description = description;
    }

    return this.repository.update(id, data);
  }

  async remove(id) {
    const category = await this.getById(id);
    const eventsUsingCategory = await this.eventsRepository.countByCategory(category.id);

    if (eventsUsingCategory > 0) {
      throw conflict('No se puede eliminar una categoria con cursos asociados');
    }

    return this.repository.remove(id);
  }
}

export const categoriesService = new CategoriesService(categoriesRepository, eventsRepository);
export default categoriesService;

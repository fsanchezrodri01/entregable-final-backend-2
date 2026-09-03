import { categoriesService } from '../services/categories.service.js';
import { CategoryDTO } from '../dto/category.dto.js';

export const getCategories = async (req, res, next) => {
  try {
    const categories = await categoriesService.list();
    res.status(200).json({ status: 'success', payload: CategoryDTO.fromList(categories) });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const category = await categoriesService.create(req.body);
    res.status(201).json({ status: 'success', payload: new CategoryDTO(category) });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const category = await categoriesService.update(req.params.cid, req.body);
    res.status(200).json({ status: 'success', payload: new CategoryDTO(category) });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    await categoriesService.remove(req.params.cid);
    res.status(200).json({ status: 'success', message: 'Categoria eliminada correctamente' });
  } catch (error) {
    next(error);
  }
};

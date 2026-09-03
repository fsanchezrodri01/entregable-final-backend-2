import { config } from '../config/config.js';

export const buildPagination = ({ page, limit }) => {
  const pageNumber = Math.max(Number(page) || 1, 1);
  const limitNumber = Math.min(Number(limit) || config.pagination.defaultLimit, config.pagination.maxLimit);

  return { pageNumber, limitNumber, skip: (pageNumber - 1) * limitNumber };
};

export const buildPagedResponse = ({ data, total, pageNumber, limitNumber }) => ({
  status: 'success',
  data,
  page: pageNumber,
  limit: limitNumber,
  total,
  totalPages: Math.ceil(total / limitNumber) || 0
});

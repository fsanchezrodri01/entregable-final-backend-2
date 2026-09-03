import mongoose from 'mongoose';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const MIN_PASSWORD_LENGTH = 6;

export const isValidEmail = email => EMAIL_REGEX.test(String(email).trim());

export const isValidObjectId = id => mongoose.Types.ObjectId.isValid(id);

export const isValidDate = value => !Number.isNaN(new Date(value).getTime());

export const isPositiveInteger = value => Number.isInteger(Number(value)) && Number(value) > 0;

export const normalizeEmail = email => String(email).toLowerCase().trim();

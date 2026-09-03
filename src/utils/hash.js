import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const createHash = async password => await bcrypt.hash(password, SALT_ROUNDS);

export const isValidPassword = async (password, hashedPassword) =>
  await bcrypt.compare(password, hashedPassword);

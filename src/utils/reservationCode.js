import { randomBytes } from 'node:crypto';

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export const generateReservationCode = (prefix = 'SAI') => {
  const bytes = randomBytes(6);
  const code = Array.from(bytes, byte => ALPHABET[byte % ALPHABET.length]).join('');
  return `${prefix}-${code}`;
};

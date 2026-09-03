import { usersRepository } from '../repositories/users.repository.js';
import { createHash, isValidPassword } from '../utils/hash.js';
import { badRequest, conflict, unauthorized } from '../utils/httpError.js';
import { isValidEmail, normalizeEmail, MIN_PASSWORD_LENGTH } from '../utils/validators.js';

class SessionsService {
  constructor(repository) {
    this.repository = repository;
  }

  async register({ first_name, last_name, email, password }) {
    if (!first_name || !last_name || !email || !password) {
      throw badRequest('Faltan campos obligatorios');
    }

    if (!isValidEmail(email)) {
      throw badRequest('El email no tiene un formato valido');
    }

    if (String(password).length < MIN_PASSWORD_LENGTH) {
      throw badRequest(`La contrasena debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`);
    }

    const normalizedEmail = normalizeEmail(email);

    if (await this.repository.getByEmail(normalizedEmail)) {
      throw conflict('El email ya esta registrado');
    }

    // El rol siempre lo asigna el backend: nunca se acepta desde el body.
    return this.repository.create({
      first_name: String(first_name).trim(),
      last_name: String(last_name).trim(),
      email: normalizedEmail,
      password: await createHash(password),
      role: 'user'
    });
  }

  async login({ email, password }) {
    if (!email || !password) {
      throw badRequest('Email y contrasena son obligatorios');
    }

    const user = await this.repository.getByEmail(normalizeEmail(email));

    // Mismo mensaje para usuario inexistente y contrasena incorrecta.
    if (!user || !(await isValidPassword(password, user.password))) {
      throw unauthorized('Credenciales invalidas');
    }

    return user;
  }

  getById(id) {
    return this.repository.getById(id);
  }
}

export const sessionsService = new SessionsService(usersRepository);
export default sessionsService;

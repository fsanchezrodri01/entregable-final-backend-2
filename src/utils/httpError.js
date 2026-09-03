export class HttpError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status;
  }
}

export const badRequest = message => new HttpError(message, 400);
export const unauthorized = (message = 'No autenticado') => new HttpError(message, 401);
export const forbidden = (message = 'No tienes permisos para realizar esta accion') => new HttpError(message, 403);
export const notFound = message => new HttpError(message, 404);
export const conflict = message => new HttpError(message, 409);

export default HttpError;

// Valores de dominio compartidos entre modelos y servicios.
export const USER_ROLES = ['admin', 'organizer', 'user'];

export const EVENT_STATUSES = ['draft', 'published', 'cancelled', 'finished'];
export const EVENT_LEVELS = ['beginner', 'intermediate', 'advanced'];
export const EVENT_FORMATS = ['curso', 'workshop', 'bootcamp', 'diplomado'];

export const TICKET_STATUSES = ['confirmed', 'pending', 'cancelled'];
// Una inscripcion ocupa cupo mientras no este cancelada.
export const ACTIVE_TICKET_STATUSES = ['confirmed', 'pending'];

// Estados de curso visibles para cualquier visitante.
export const PUBLIC_EVENT_STATUSES = ['published', 'finished'];

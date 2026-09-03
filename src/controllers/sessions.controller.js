import { sessionsService } from '../services/sessions.service.js';

export const getCurrent = async (req, res, next) => {
  try {
    const user = await sessionsService.getCurrent();
    res.status(200).json({ status: 'success', payload: user });
  } catch (error) {
    next(error);
  }
};

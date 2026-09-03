import { eventsService } from '../services/events.service.js';
import { EventDTO } from '../dto/event.dto.js';
import { buildPagedResponse } from '../utils/pagination.js';

export const getEvents = async (req, res, next) => {
  try {
    const { events, total, pageNumber, limitNumber } = await eventsService.list(req.query, req.user);

    res.status(200).json(
      buildPagedResponse({ data: EventDTO.fromList(events), total, pageNumber, limitNumber })
    );
  } catch (error) {
    next(error);
  }
};

export const getEventById = async (req, res, next) => {
  try {
    const event = await eventsService.getById(req.params.eid);
    res.status(200).json({ status: 'success', payload: new EventDTO(event) });
  } catch (error) {
    next(error);
  }
};

export const createEvent = async (req, res, next) => {
  try {
    const event = await eventsService.create(req.body, req.user);
    res.status(201).json({ status: 'success', payload: new EventDTO(event) });
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (req, res, next) => {
  try {
    const event = await eventsService.update(req.params.eid, req.body, req.user);
    res.status(200).json({ status: 'success', payload: new EventDTO(event) });
  } catch (error) {
    next(error);
  }
};

export const changeEventStatus = async (req, res, next) => {
  try {
    const event = await eventsService.changeStatus(req.params.eid, req.body.status, req.user);
    res.status(200).json({ status: 'success', payload: new EventDTO(event) });
  } catch (error) {
    next(error);
  }
};

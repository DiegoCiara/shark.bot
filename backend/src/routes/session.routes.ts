import SessionController from '@controllers/SessionController';
import Router from 'express';

const routes = Router();

routes.get('/', SessionController.findSessions);

export default routes;

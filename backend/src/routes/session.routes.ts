import SessionController from '@controllers/SessionController';
import Router from 'express';

const routes = Router();

routes.get('/', SessionController.findSessions);
routes.get('/:id', SessionController.findSessionById);
routes.post('/', SessionController.create);
routes.post('/connect/:id', SessionController.connect);
routes.delete('/:id', SessionController.delete);
// routes.get('/connect-session', SessionController.connectSession);

export default routes;
 
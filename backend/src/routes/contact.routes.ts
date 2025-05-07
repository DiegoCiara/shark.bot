import Router from 'express';
import DeclarationController from '@controllers/ContactController';
import { ensureAuthenticated } from '@src/app/middlewares/ensureAuthenticated';

const routes = Router();

routes.post('/', DeclarationController.create);
routes.get('/', ensureAuthenticated, DeclarationController.findContacts);
routes.get('/:id', ensureAuthenticated, DeclarationController.findContactById);
routes.put('/:id', ensureAuthenticated, DeclarationController.update);
routes.delete('/:id', ensureAuthenticated, DeclarationController.delete);

export default routes;

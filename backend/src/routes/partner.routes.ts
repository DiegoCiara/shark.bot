import Router from 'express';
import DeclarationController from '@controllers/PartnerController';
import { ensureAuthenticated } from '@src/app/middlewares/ensureAuthenticated';
import { ensureAdmin } from '@middlewares/ensureAdmin';

const routes = Router();

routes.post('/', ensureAuthenticated, ensureAdmin, DeclarationController.create);
routes.get('/', ensureAuthenticated, ensureAdmin, DeclarationController.findPartners);
routes.get('/:id', ensureAuthenticated, ensureAdmin, DeclarationController.findPartnerById);
routes.put('/:id', ensureAuthenticated, ensureAdmin, DeclarationController.update);
routes.delete('/:id', ensureAuthenticated, ensureAdmin, DeclarationController.delete);


export default routes;


import Router from 'express';
import DealController from '@controllers/DealController';
import { ensureAuthenticated } from '@src/app/middlewares/ensureAuthenticated';

const routes = Router();

routes.post('/', ensureAuthenticated, DealController.create);
routes.get('/', ensureAuthenticated, DealController.findDeals);
routes.get('/:id', ensureAuthenticated, DealController.findDealById);
routes.put('/:id', ensureAuthenticated, DealController.update);
routes.delete('/:id', ensureAuthenticated, DealController.delete);


export default routes;


import Router from 'express';
import  ProductController from '@controllers/ProductController';
import { ensureAuthenticated } from '@src/app/middlewares/ensureAuthenticated';
import { ensureAdmin } from '@middlewares/ensureAdmin';

const routes = Router();

routes.post('/', ensureAuthenticated, ensureAdmin, ProductController.create);
routes.get('/', ensureAuthenticated, ensureAdmin, ProductController.findProducts);
routes.get('/:id', ensureAuthenticated, ensureAdmin, ProductController.findProductById);
routes.put('/:id', ensureAuthenticated, ensureAdmin, ProductController.update);
routes.delete('/:id', ensureAuthenticated, ensureAdmin, ProductController.delete);


export default routes;


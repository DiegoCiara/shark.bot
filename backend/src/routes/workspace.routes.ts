import Router from 'express';
import WorkspaceController from '@controllers/WorkspaceController';
import { ensureAuthenticated } from '@src/app/middlewares/ensureAuthenticated';
import { ensureAdmin } from '@middlewares/ensureAdmin';

const routes = Router();

routes.get('/', ensureAuthenticated, ensureAdmin, WorkspaceController.findWorkspaceById);
// routes.post('/', ensureAuthenticated, WorkspaceController.create);
routes.put('/', ensureAuthenticated, ensureAdmin, WorkspaceController.update);


export default routes;


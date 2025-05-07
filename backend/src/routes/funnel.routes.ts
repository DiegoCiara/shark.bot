import Router from 'express';
import  FunnelController from '@controllers/FunnelController';
import { ensureAuthenticated } from '@src/app/middlewares/ensureAuthenticated';
import { ensureAdmin } from '@middlewares/ensureAdmin';

const routes = Router();

routes.post('/', ensureAuthenticated, ensureAdmin, FunnelController.create);
routes.post('/pipeline/:id', ensureAuthenticated, ensureAdmin, FunnelController.createPipeline);
routes.get('/', ensureAuthenticated, ensureAdmin, FunnelController.findFunnels);
routes.get('/pipelines/:funnelId', ensureAuthenticated, ensureAdmin, FunnelController.findPipelines);
routes.get('/:id', ensureAuthenticated, ensureAdmin, FunnelController.findFunnelById);
routes.get('/pipeline/:id', ensureAuthenticated, ensureAdmin, FunnelController.findPipelineById);
routes.put('/:id', ensureAuthenticated, ensureAdmin, FunnelController.update);
routes.put('/pipeline/:id', ensureAuthenticated, ensureAdmin, FunnelController.updatePipeline);
routes.delete('/:id', ensureAuthenticated, ensureAdmin, FunnelController.delete);
routes.delete('/pipeline/:id', ensureAuthenticated, ensureAdmin, FunnelController.deletePipeline);

export default routes;

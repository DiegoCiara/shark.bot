import Router from 'express';
import ThreadController from '@controllers/ThreadController';


const routes = Router();
routes.get('/', ThreadController.findThreads)
routes.get('/:id', ThreadController.findThreadById)

export default routes;


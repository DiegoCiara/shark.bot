import Router from 'express';
import ThreadController from '@controllers/ThreadController';
import { ensureAuthenticated } from '@middlewares/ensureAuthenticated';


const routes = Router();
routes.get('/', ensureAuthenticated, ThreadController.findThreads)
routes.get('/:id', ensureAuthenticated, ThreadController.findThreadById)
routes.put('/assume/:id', ensureAuthenticated, ThreadController.assumeThread)
routes.post('/send/:id', ensureAuthenticated, ThreadController.send)
routes.post('/close-thread/:id', ensureAuthenticated, ThreadController.send)

export default routes;


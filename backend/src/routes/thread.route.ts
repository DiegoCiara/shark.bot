import Router from 'express';
import ThreadController from '@src/app/controllers/ThreadController';
import { ensureAuthenticated } from '@src/app/middlewares/ensureAuthenticated';
import { ensureProfile } from '@middlewares/ensureProfile';
import { ensureAdmin } from '@middlewares/ensureAdmin';


const routes = Router();
routes.post('/', ThreadController.runThread)


export default routes;


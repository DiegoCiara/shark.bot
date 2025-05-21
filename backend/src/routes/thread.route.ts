import Router from 'express';
import ThreadController from '@src/app/controllers/ThreadController';


const routes = Router();
routes.post('/', ThreadController.runThread)


export default routes;


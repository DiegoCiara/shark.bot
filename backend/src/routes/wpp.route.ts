import Router from 'express';
import WppController from '@controllers/WppController';


const routes = Router();
routes.post('/', WppController.runThread)


export default routes;


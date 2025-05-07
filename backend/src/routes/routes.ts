import Router from 'express';
import AuthRoutes from './auth.routes';
import UserRoutes from './user.routes';
import ProfileRoutes from './profile.routes';
import ContactRoutes from './contact.routes';
import DealRoutes from './deal.routes';
import WorkspaceRoutes from './workspace.routes';
import ProductRoutes from './product.routes';
import FunnelRoutes from './funnel.routes';
import PartnerRoutes from './partner.routes';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const routes = Router();

const base = { 'API Wave CRM': 'Online' };

routes.get('/', (req, res) => {
  res.json(base);
});

const port = process.env.CLIENT_PORT;

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Wave CRM',
      version: '1.0.0',
      description: 'Documentação da API',
    },
    servers: [
      {
        url: `http://localhost:${port}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/app/controllers/*.ts', './src/app/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

routes.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
routes.use('/auth/', AuthRoutes);
routes.use('/user/', UserRoutes);
routes.use('/funnel/', FunnelRoutes);
routes.use('/partner/', PartnerRoutes);
routes.use('/product/', ProductRoutes);
routes.use('/profile/', ProfileRoutes);
routes.use('/contact/', ContactRoutes);
routes.use('/deal/', DealRoutes);
routes.use('/workspace/', WorkspaceRoutes);

export default routes;

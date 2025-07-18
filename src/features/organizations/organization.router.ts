import authMiddleWare from '@middlewares/authMiddleware';
import { Router } from 'express';
import { OrganizationController } from './organization.controller';


const organizationRouter = Router();

organizationRouter.use(authMiddleWare);
// authenticated routes
organizationRouter.post('/', OrganizationController.createOrganization);
organizationRouter.get('/', OrganizationController.getOrganizations);

export default organizationRouter;
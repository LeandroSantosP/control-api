import { SessionController } from '@/modules/authentication/Session/SessionController';
import { Router } from 'express';

const AuthRoutes = Router();

const sessionController = new SessionController();

AuthRoutes.get('/', sessionController.handle);

export { AuthRoutes };

import { UserAuthentication } from '../infra/middleware/UserAuthentication';
import { CreateNewGoalsController } from '@/modules/Goals/useCases/CreateNewGoals/CreateNewGoalsController';
import { Router } from 'express';

const GoalsRoutes = Router();

const createNewGoalsController = new CreateNewGoalsController();

GoalsRoutes.post('/', UserAuthentication, createNewGoalsController.handle);

export { GoalsRoutes };

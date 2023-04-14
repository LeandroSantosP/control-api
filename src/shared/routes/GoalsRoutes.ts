import { UserAuthentication } from '../infra/middleware/UserAuthentication';
import { CreateNewGoalsController } from '@/modules/Goals/useCases/CreateNewGoals/CreateNewGoalsController';
import { Router } from 'express';
import { UpdatedGoalsController } from '@/modules/Goals/useCases/UpdateGoals/UpdateGoalController';

const GoalsRoutes = Router();

const createNewGoalsController = new CreateNewGoalsController();
const updatedGoalsController = new UpdatedGoalsController();

GoalsRoutes.post('/', UserAuthentication, createNewGoalsController.handle);
GoalsRoutes.patch('/', UserAuthentication, updatedGoalsController.handle);

export { GoalsRoutes };

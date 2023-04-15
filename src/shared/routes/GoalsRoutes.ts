import { UserAuthentication } from '../infra/middleware/UserAuthentication';
import { CreateNewGoalsController } from '@/modules/Goals/useCases/CreateNewGoals/CreateNewGoalsController';
import { Router } from 'express';
import { UpdatedGoalsController } from '@/modules/Goals/useCases/UpdateGoals/UpdateGoalController';
import { ListGoalsController } from '@/modules/Goals/useCases/ListGoals/LIstGoalsController';

const GoalsRoutes = Router();

const createNewGoalsController = new CreateNewGoalsController();
const updatedGoalsController = new UpdatedGoalsController();
const listGoalsController = new ListGoalsController();

GoalsRoutes.get('/', UserAuthentication, listGoalsController.handle);
GoalsRoutes.post('/', UserAuthentication, createNewGoalsController.handle);
GoalsRoutes.patch('/', UserAuthentication, updatedGoalsController.handle);

export { GoalsRoutes };

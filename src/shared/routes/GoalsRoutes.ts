import { UserAuthentication } from '../infra/middleware/UserAuthentication';
import { CreateNewGoalsController } from '@/modules/Goals/useCases/CreateNewGoals/CreateNewGoalsController';
import { Request, Response, Router } from 'express';
import { UpdatedGoalsController } from '@/modules/Goals/useCases/UpdateGoals/UpdateGoalController';
import { ListGoalsController } from '@/modules/Goals/useCases/ListGoals/LIstGoalsController';
import { DeletedGoalsController } from '@/modules/Goals/useCases/DeletedGoal/DeletedGoalController';

const GoalsRoutes = Router();

const createNewGoalsController = new CreateNewGoalsController();
const updatedGoalsController = new UpdatedGoalsController();
const listGoalsController = new ListGoalsController();
const deletedGaolsController = new DeletedGoalsController();

/*
Fields:{
   user_id: string
}: middleware


Get all user Goals // need be authenticated by middleware for acesse this route
*/
GoalsRoutes.get(
   '/',
   UserAuthentication,
   async (req: Request, res: Response) => {
      const response = await listGoalsController.interceptH(
         listGoalsController.handle
      );
      const { body, statusCode, type } = await response(req, res);

      return res.status(statusCode)[type](body);
   }
);

/*
Fields:{
   expectated_expense,
   expectated_revenue,
   month,
}: req.body


create a new Goal for month need to pass month where the user wanna set your goal // need be authenticated by middleware for acesse this route
*/
GoalsRoutes.post('/', UserAuthentication, createNewGoalsController.handle);

/*
Fields:{
         createIfNotExist: boolean | undefined,
         expectated_expense: string | | undefined,
         expectated_revenue:string | undefined,
         dataForUpdate: Array<{
               month: string;
               expectated_expense: string | undefined;
               expectated_revenue: string | undefined;
          }> | undefined,
         goal_id,
}: req.body


Updated a single or multiple, for singles goal need to pass goal_id expectated_expense or expectated_revenue or both in the body request,
for multiple goals you need do pass in follow formatted in body: dataForUpdate: Array<{"month":string, "expectated_expense": string, "expectated_revenue":string}>
// need be authenticated by middleware for acesse this route
*/
GoalsRoutes.patch('/', UserAuthentication, updatedGoalsController.handle);

/*
Fields:{
   expectated_expense,
   expectated_revenue,
   month,
}: req.body


delete a single or multiple goals, for singles just pass in the body request follow formatted: "month":string
for multiple pass "month": string[]
// need be authenticated by middleware for acesse this route
*/
GoalsRoutes.delete('/', UserAuthentication, deletedGaolsController.execute);

export { GoalsRoutes };

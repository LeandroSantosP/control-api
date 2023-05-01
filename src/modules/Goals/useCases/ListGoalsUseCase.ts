import { IUserRepository } from '@/modules/users/infra/repository/IUserRepository';
import { User } from '@prisma/client';
import { inject, injectable } from 'tsyringe';
import { IGoalsRepository } from '../infra/repository/IGoalsRepository';

@injectable()
export class ListGoalsUseCase {
   constructor(
      @inject('GoalsRepository')
      private readonly GoalsRepository: IGoalsRepository,
      @inject('UserRepository')
      private readonly UserRepository: IUserRepository
   ) {}

   async execute(user_id: string) {
      const UserGoals = await this.GoalsRepository.list(user_id);
      const userInfos = (await this.UserRepository.GetUserById(
         user_id
      )) as User;

      //validacoes

      const MonthFormatted = UserGoals.map((goal) => {
         type monthNamesProps = {
            [key: string]: string;
         };

         const monthNames = {
            '01': 'Janeiro',
            '02': 'Fevereiro',
            '03': 'Março',
            '04': 'Abril',
            '05': 'Maio',
            '06': 'Junho',
            '07': 'Julho',
            '08': 'Agosto',
            '09': 'Setembro',
            '10': 'Outubro',
            '11': 'Novembro',
            '12': 'Dezembro',
         } as monthNamesProps;

         const currentMonth = monthNames[goal.month];
         return {
            name: currentMonth,
            number: Number(goal.month),
            expectated_expense: goal.expectated_expense,
            expectated_revenue: goal.expectated_revenue,
         };
      }).sort((a, b) => a.number - b.number);

      const extractUserInfos = Object.entries(userInfos)
         .map(([key, value]) => {
            const allowedKeys = ['id', 'name', 'avatar', 'created_at'];

            if (allowedKeys.includes(key)) {
               return {
                  [key]: value,
               };
            }

            return;
         })
         .filter((i) => i !== undefined);

      const user = Object.assign({}, ...extractUserInfos);

      return {
         user,
         MonthFormatted,
      };
   }
}

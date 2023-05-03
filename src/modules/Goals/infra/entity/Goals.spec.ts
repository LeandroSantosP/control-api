import { randomUUID } from 'crypto';
import { GoalEntity } from './Goals';

test('should be able to create a new goal', () => {
   const user_id = randomUUID();
   const sut = GoalEntity.create({
      expected_expense: -123.11,
      expected_revenue: 122.11,
      month: '12',
      user_id,
      createAt: new Date(),
      updatedAt: new Date(),
   });

   expect(sut.month.getValue).toEqual('12');
   expect(sut.ExpectatedExpense.GetValue).toEqual(-123.11);
   expect(sut.ExpectatedRevenue.GetValue).toEqual(122.11);
   expect(sut.userId).toEqual(user_id);
});

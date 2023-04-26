import { Birthday } from './Birthday';
import { AppError } from '@/shared/infra/middleware/AppError';

it('should throw an error for invalid format', async () => {
   expect(() => new Birthday('WRONG-FORMAT')).toThrow(
      new AppError('Birthday is invalid format, dd/mm/yyyy')
   );
});

it('should return true if age is greater than 16', () => {
   const eighteenYearsAgo = new Date();
   eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

   expect(() => new Birthday('21/07/2000')).toBeTruthy();
});

it('should be able to create a birthday valid', async () => {
   expect(() => new Birthday('21/06/2007')).toThrow(
      new AppError('Birthday must be over 18 years old')
   );
});

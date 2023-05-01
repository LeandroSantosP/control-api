import { AppError } from '@/shared/infra/middleware/AppError';
import { Email } from './Email';

test('Should throw an Error if user not provider email', async () => {
   expect(() => new Email(undefined as unknown as string)).toThrow(
      new AppError('Email is required.')
   );
});

test('Should throw an Error if user not provider valid email', async () => {
   const invalidEmail = 'invalid@gmail';

   expect(() => new Email(invalidEmail)).toThrow(
      new AppError('Invalid email Format.')
   );
});

import { AppError } from '@/shared/infra/middleware/AppError';
import { Password } from './Password';

test('should be able to create a new crypt password.', async () => {
   let pass = 'senha123';
   const sut = await Password.create(pass, 1);
   expect(sut.GetPassWordHash.length).toBe(60);
});

test('should password not be undefined', async () => {
   let pass = undefined as unknown as string;
   await expect(() => Password.create(pass)).rejects.toThrow(
      new AppError('Password is required')
   );
});

test('should password not be less then 8 caracteres.', async () => {
   let pass = 's123';
   await expect(() => Password.create(pass)).rejects.toThrow(
      new AppError('Password must be at least 8 characters long')
   );
});

test('should password not be less then 8 caracteres.', async () => {
   let pass = 'senhaSsssss2';
   await expect(() => Password.create(pass)).rejects.toThrow(
      new AppError('Password must contain at least 3 numbers!')
   );
});

test('should be able to validate a password.', async () => {
   let pass = 'senha123';
   const passHash = await Password.create(pass);

   const { validade } = new Password('senha123');

   expect(await validade('senha123', passHash.GetPassWordHash)).toBeTruthy();
});

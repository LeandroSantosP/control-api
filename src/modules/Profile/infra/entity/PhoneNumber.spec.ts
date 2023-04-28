import { AppError } from '@/shared/infra/middleware/AppError';
import { PhoneNumber } from './PhoneNumber';

test('should be create a new phone number', () => {
   expect(new PhoneNumber('(11) 9999-11989').getValue).toBe('(11) 9999-11989');
});

test('should not be able to create a new phone number with wrong ddd', () => {
   expect(() => new PhoneNumber('(111) 9999-11989').getValue).toThrow(
      new AppError('Invalid phone number format')
   );
});

test('if phone number if not provider(undefined) must be empty string set', () => {
   expect(new PhoneNumber(undefined).getValue).toBe('');
});

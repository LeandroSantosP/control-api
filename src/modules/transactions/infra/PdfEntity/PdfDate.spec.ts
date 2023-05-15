import 'reflect-metadata';
import { AppError } from '@/shared/infra/middleware/AppError';
import { DateFnsProvider } from '@/shared/providers/DateProvider/implementation/DateFnsProvider';
import { PdfDate } from './PdfDate';

test('should not be able te create a date with invalid format!', () => {
   expect(() => new PdfDate(new DateFnsProvider(), 'leandro').verify()).toThrow(
      new AppError('Invalid date format.')
   );
});

test('should be able te create a date with valid format!', () => {
   expect(() =>
      new PdfDate(new DateFnsProvider(), '2000-03-22').verify()
   ).toBeTruthy();
});

test('should be able get date!', () => {
   expect(
      new PdfDate(new DateFnsProvider(), '2000-03-22').verify().getDate
   ).toBe('2000-03-22');
});

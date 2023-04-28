import { Salary } from './Salary';

test('should be able to create new Salary', () => {
   expect(() => new Salary('111.09')).not.toThrowError();
});

test('should new be able to create new Salary with invalid data', () => {
   expect(() => new Salary('111.090')).toThrowError();
});

test("if salary if not provider(undefined) must be '0.00' set", () => {
   expect(new Salary(undefined).getValue).toBe('0.00');
});

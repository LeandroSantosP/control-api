import { Salary } from './Salary';

test('should be able to create new Salary', () => {
   expect(() => new Salary('111.09')).not.toThrowError();
});

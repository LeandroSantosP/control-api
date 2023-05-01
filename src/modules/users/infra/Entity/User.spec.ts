import { User } from './User';

test('should be able to create an user', async () => {
   const sut = await User.create({
      name: 'leandro',
      email: 'leandro@gmail.com',
      password: 'senha123',
   });

   expect(sut.name.GetValue).toBe('leandro');
   expect(sut.email.GetValue).toBe('leandro@gmail.com');
   expect(sut.password.GetPassWordHash).toBeTruthy();
   expect(sut.admin).toBeFalsy();
   expect(sut.deleted_at).toBeNull();
   expect(sut.created_at).toBeInstanceOf(Date);
   expect(sut.updated_at).toBeInstanceOf(Date);
});

import { AppError } from '@/shared/infra/middleware/AppError';
import { Avatar } from './Avatar';

const file = {
   fieldname: 'avatar',
   originalname: 'example.png',
   encoding: '7bit',
   mimetype: 'image/jpeg',
   buffer: Buffer.from('example image buffer'),
   size: 1000,
} as Express.Multer.File | undefined;

test('Must not be a possible to create an avatar with a valid type.', () => {
   const fileWithWrongFormat = {
      ...file,
      originalname: 'example.sv',
   } as Express.Multer.File | undefined;
   expect(() => new Avatar(fileWithWrongFormat)).toThrow(
      new AppError(
         'Image format not allowed, follow formats is allowed: png, jpg, jpeg'
      )
   );
});

test('Must be a possible to create an avatar with a valid type.', () => {
   const sut = new Avatar(file);
   expect(sut.getValue).toHaveProperty('fieldname', 'avatar');
   expect(sut.getValue).toHaveProperty('originalname', 'example.png');
   expect(sut.getValue).toHaveProperty('encoding', '7bit');
   expect(sut.getValue).toHaveProperty('mimetype', 'image/jpeg');
   expect(sut.getValue).toHaveProperty('buffer');
   expect(sut.getValue).toHaveProperty('size', 1000);
});

test('Must not be a possible to create an avatar if size is greater than 1000.', () => {
   const fileWithWrongSize = {
      ...file,
      size: 99999999999,
   } as Express.Multer.File | undefined;

   expect(() => new Avatar(fileWithWrongSize)).toThrow(
      new AppError('Image size is too large')
   );
});

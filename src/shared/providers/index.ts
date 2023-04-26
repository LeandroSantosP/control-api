import { container } from 'tsyringe';
import { IAuthProvider } from './AuthProvider/IAuthProvider';
import { JwtAuthProvider } from './AuthProvider/implementation/JwtAuthProvider';
import { IDateProvider } from './DateProvider/IDateProvider';
import { DateFnsProvider } from './DateProvider/implementation/DateFnsProvider';
import { FirebaseStorageProvider } from './UploadProvider/implementation/FirebaseStorageProvider';
import { IUploadProvider } from './UploadProvider/IUploadProvider';

container.registerSingleton<IAuthProvider>('JwtAuthProvider', JwtAuthProvider);

container.registerSingleton<IDateProvider>('DateFnsProvider', DateFnsProvider);

container.registerSingleton<IUploadProvider>(
   'FirebaseStorageProvider',
   FirebaseStorageProvider
);

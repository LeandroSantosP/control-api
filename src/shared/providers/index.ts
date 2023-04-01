import { container } from 'tsyringe';
import { IAuthProvider } from './AuthProvider/IAuthProvider';
import { JwtAuthProvider } from './AuthProvider/implementation/JwtAuthProvider';
import { IDateProvider } from './DateProvider/IDateProvider';
import { DateFnsProvider } from './DateProvider/implementation/DateFnsProvider';
import { LocalStorageProvider } from './UploadProvider/implementation/LocalStorageProvider';
import { IUploadProvider } from './UploadProvider/IUploadProvider';

container.registerSingleton<IAuthProvider>('JwtAuthProvider', JwtAuthProvider);

container.registerSingleton<IUploadProvider>(
   'LocalStorageProvider',
   LocalStorageProvider
);

container.registerSingleton<IDateProvider>('DateFnsProvider', DateFnsProvider);

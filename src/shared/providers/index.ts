import { container } from 'tsyringe';
import { IAuthProvider } from './AuthProvider/IAuthProvider';
import { JwtAuthProvider } from './AuthProvider/implementation/JwtAuthProvider';
import { LocalStorageProvider } from './UploadProvider/implementation/LocalStorageProvider';
import { IUploadProvider } from './UploadProvider/IUploadProvider';

container.registerSingleton<IAuthProvider>('JwtAuthProvider', JwtAuthProvider);

container.registerSingleton<IUploadProvider>(
   'LocalStorageProvider',
   LocalStorageProvider
);

import { container } from 'tsyringe';
import { IAuthProvider } from './AuthProvider/IAuthProvider';
import { JwtAuthProvider } from './AuthProvider/implementation/JwtAuthProvider';

container.registerSingleton<IAuthProvider>('JwtAuthProvider', JwtAuthProvider);

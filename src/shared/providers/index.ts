import { container } from 'tsyringe';
import { IAuthProvider } from './AuthProvider/IAuthProvider';
import { JwtAuthProvider } from './AuthProvider/implementation/JwtAuthProvider';
import { IDateProvider } from './DateProvider/IDateProvider';
import { DateFnsProvider } from './DateProvider/implementation/DateFnsProvider';
import { HtmlPdfProvider } from './PdfProvider/implementation/HtmlPdfProvider';
import { IPdfProviderProvider } from './PdfProvider/IPdfProviderProvider';
import { EtherealProvider } from './SederEmailProvider/implementation/EtherealProvider';
import { ISederEmailProvider } from './SederEmailProvider/ISederEmailProvider';
import { FirebaseStorageProvider } from './UploadProvider/implementation/FirebaseStorageProvider';
import { IUploadProvider } from './UploadProvider/IUploadProvider';

container.registerSingleton<IAuthProvider>('JwtAuthProvider', JwtAuthProvider);

container.registerSingleton<IDateProvider>('DateFnsProvider', DateFnsProvider);

container.registerSingleton<IPdfProviderProvider>(
   'HtmlPdfProvider',
   HtmlPdfProvider
);

container.registerSingleton<IUploadProvider>(
   'FirebaseStorageProvider',
   FirebaseStorageProvider
);

container.registerSingleton<ISederEmailProvider>(
   'EtherealProvider',
   EtherealProvider
);

import serviceAccountPROD from '@/config/control-cb6dd-firebase-adminsdk-cnxr9-1025e08446.json';
import admin from 'firebase-admin';

admin.initializeApp({
   //@ts-ignore
   credential: admin.credential.cert(serviceAccountPROD),
   storageBucket: 'gs://control-cb6dd.appspot.com/',
});

export { admin };

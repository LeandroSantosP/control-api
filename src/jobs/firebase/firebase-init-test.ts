import serviceAccountTEST from '@/config/controltest.json';
import admin from 'firebase-admin';

admin.initializeApp({
   //@ts-ignore
   credential: admin.credential.cert(serviceAccountTEST),
   storageBucket: 'gs://controltest-36c47.appspot.com',
});

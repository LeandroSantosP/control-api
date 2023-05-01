import 'dotenv/config';

import serviceAccountPROD from '@/config/control-prod.json';
import admin from 'firebase-admin';

admin.initializeApp({
   //@ts-ignore
   credential: admin.credential.cert(serviceAccountPROD),
   storageBucket: 'gs://control-cb6dd.appspot.com/',
});

export { admin };

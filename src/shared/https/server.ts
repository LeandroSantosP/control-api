import express, { response } from 'express';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import '@/shared/infra/tsyringe';
import swaggerDocument from '../../../swagger.json';

import { allRoutes } from '../routes';
import { cwd } from 'process';

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/swagger', (req, res) => {
   return res.sendFile(cwd() + '/swagger.json');
});

app.get('/docs', (req, res) => {
   return res.sendFile(cwd() + '/index.html');
});

app.use(cors());

app.use(express.json());
app.use(allRoutes);

export { app };

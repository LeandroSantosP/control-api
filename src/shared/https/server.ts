import express from 'express';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import '@/shared/infra/tsyringe';
import { resolve } from 'path';
import swaggerDocument from '../../docs/swagger.json';

import { allRoutes } from '../routes';
import { cwd } from 'process';
import { engine } from 'express-handlebars';

const app = express();
const publicFolder = resolve(__dirname + '../../../../public/');
app.use(express.static(publicFolder));

app.engine(
   'handlebars',
   engine({
      layoutsDir: publicFolder + '/layouts',
   })
);
app.set('view engine', 'handlebars');

app.get('/test', (req, res) => {
   res.render('pdf');
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/swagger', (req, res) => {
   return res.sendFile(cwd() + '/swagger.json');
});

app.get('/docs', (req, res) => {
   return res.sendFile(cwd() + '/index.html');
});

app.use(
   cors({
      origin: '*',
   })
);

app.use(express.json());
app.use(allRoutes);

export { app };

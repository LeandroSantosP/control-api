import '@/shared/infra/tsyringe';

import express from 'express';
import { allRoutes } from '../router';

const app = express();

app.use(express.json());
app.use(allRoutes);

export { app };

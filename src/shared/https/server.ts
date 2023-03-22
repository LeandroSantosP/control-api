import express from 'express';
import cors from 'cors';
import '@/shared/infra/tsyringe';

import { allRoutes } from '../router';

const app = express();

app.use(cors());

app.use(express.json());
app.use(allRoutes);

export { app };

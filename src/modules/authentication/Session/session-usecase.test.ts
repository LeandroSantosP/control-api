import 'reflect-metadata';
import request from 'supertest';

import { app } from '@/shared/https/server';

const server = app.listen();

describe('Server', () => {
  it('should return not found when wrong credentials!', async () => {
    const email = 'test@example.com';
    const password = 'test123ABS33223324';

    const result = await request(server).get('/auth').auth(email, password);

    expect(result.status).toEqual(400);
    expect(result.body).toHaveProperty('message');
  });
});

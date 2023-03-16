import 'reflect-metadata';
import request from 'supertest';
import { sign } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { app } from '@/shared/https/server';
import auth from '@/config/auth';
import { prisma } from '@/database/prisma';

const email = 'test@example.com';
const password = 'test123ABS33223324';
const name = 'John Doe';

let server = app.listen(3333);

describe('Server', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  afterEach(async () => {
    await prisma.$disconnect();
  });

  afterAll((done) => {
    server.close(done);
  });

  it('should be able create a transaction', async () => {
    const { secretToken, saltRounds } = auth;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = await prisma.user.create({
      data: {
        email,
        password: passwordHash,
        name,
      },
    });

    const token = sign({ sub: user.id, email: user.email }, secretToken);

    const result = await request(server)
      .post('/transaction')
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: 'Desc',
        value: '10',
      });

    expect(result.body.id).toBeTruthy();
    expect(result.body.description).toBeTruthy();
    expect(result.body.userId).toEqual(user.id);
  });
});

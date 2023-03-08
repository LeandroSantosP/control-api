import { app } from './server';

const server_post = process.env.SERVER_PORT;

app.listen(server_post, () =>
  console.log(`Server Is Running In Port ${server_post}! 🚀`)
);

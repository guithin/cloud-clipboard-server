import { createClient } from 'redis';

const client = createClient({
  url: process.env.REDIS_URL,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
});

export const init =async () => {
  await client.connect();
};

export default client;

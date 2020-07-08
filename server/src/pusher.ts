import { config } from 'dotenv';
import Pusher from 'pusher';

config();

const appId = process.env.PUSHER_APP_ID as string;
const key = process.env.PUSHER_APP_KEY as string;
const secret = process.env.PUSHER_APP_SECRET as string;
const cluster = process.env.PUSHER_APP_CLUSTER as string;

const pusher = new Pusher({
  appId,
  key,
  secret,
  cluster,
  useTLS: true,
});

export default pusher;

import Pusher from 'pusher';
import { config } from 'dotenv';

config();

const appId = process.env.PUSHER_APP_ID;
const key = process.env.PUSHER_APP_KEY;
const secret = process.env.PUSHER_APP_SECRET;
const cluster = process.env.PUSHER_APP_CLUSTER;

let pusher: Pusher | null = null;

if (appId && key && secret && cluster) {
  pusher = new Pusher({
    appId,
    key,
    secret,
    cluster,
    useTLS: true
  });
}

export default pusher;

import Agenda from 'agenda';
import { config } from 'dotenv';

if (process.env.NODE_ENV === 'development') {
  config();
}

const mongoConnectionString: string = process.env.MONGO_DB_URL as string;

const agenda = new Agenda({
  db: {
    address: mongoConnectionString,
    options: {
      useUnifiedTopology: true
    }
  }
});

(async function () {
  agenda.maxConcurrency(25);
  agenda.start();
}());

export default agenda;

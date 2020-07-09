import Agenda from 'agenda';
import { config } from 'dotenv';
config();

const mongoConnectionString: string = process.env.MONGO_DB_URL as string;
let agenda: Agenda | null = null;

if (mongoConnectionString) {
  agenda = new Agenda({
    db: {
      address: mongoConnectionString,
      options: {
        useUnifiedTopology: true
      }
    }
  });

  (async function () {
    if (agenda) {
      agenda.maxConcurrency(25);
      agenda.on('ready', () => {
        agenda && agenda.start();
      });
    }
  }());
}

export default agenda;

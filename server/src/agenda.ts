import Agenda from 'agenda';
import { config } from 'dotenv';
import { Dropbox } from 'dropbox';
import { ErrorLogger } from './logger';
import PubSub from './pubSub';

interface Job {
  accessToken: string;
  asyncJobId: string;
}

if (process.env.NODE_ENV === 'development') {
  config();
}

const mongoConnectionString: string = process.env.MONGO_DB_URL as string;

const agenda = new Agenda({ db: { address: mongoConnectionString } });

agenda.define<Job>('poll batch status', async job => {
  const { accessToken, asyncJobId } = job.attrs.data;
  try {
    const result = await new Dropbox({
      accessToken: accessToken,
      clientId: process.env.CLIENT_ID
    }).filesDeleteBatchCheck({
      async_job_id: asyncJobId
    });

    console.log(result);

    if (result['.tag'] === 'complete') {
      console.log('completed', result.entries);
      PubSub.publish('dropbox_batch_work_complete', {
        job_id: asyncJobId,
        entries: result.entries
      });
    } else if (result['.tag'] === 'in_progress') {
      console.log('polling');
      PubSub.publish('dropbox_batch_work_in_progress', {
        job_id: asyncJobId
      });
    } else if (result['.tag'] === 'failed') {
      console.log('failed', result.failed);
      PubSub.publish('dropbox_batch_work_failed', {
        job_id: asyncJobId,
        error: result.failed
      });
    }
  } catch (error) {
    ErrorLogger.log(error);
  }
});

export default agenda;

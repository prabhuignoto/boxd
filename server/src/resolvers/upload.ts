import pubsub from '../pubSub';

export default {
  Subscription: {
    fileUploaded: {
      subscribe: () => pubsub.asyncIterator('upload_completed')
    }
  }
};

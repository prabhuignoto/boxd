import pubsub from '../pubSub';

export default {
  Subscription: {
    fileUploaded: {
      subscribe: () => pubsub.asyncIterator('uploadCompleted')
    }
  }
};

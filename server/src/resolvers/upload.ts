// import { createLogger, transports } from "winston";
// const errorLogger = createLogger({
//   level: "error",
//   transports: [new transports.Console()],
// });

import pubsub from "../pubSub";

export default {
  Subscription: {
    fileUploaded: {
      subscribe: () => pubsub.asyncIterator("upload_completed"),
    },
  },
};

import {MongoClient } from "mongodb";

export default new Promise<MongoClient>(function(resolve, reject) {
  MongoClient.connect(process.env.MONGO_DB_URL as string, (error, client) => {
    try {
      if(error) {
        reject(new Error("Failed to Instantiate Client"));
      }
      resolve(client);
    } catch (error) {
      reject(new Error("Failed to Instantiate Client"));
    }
  });
});
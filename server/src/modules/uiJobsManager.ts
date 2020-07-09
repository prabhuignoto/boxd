/* eslint-disable no-unused-vars */
import DB from './db';
import { ErrorLogger, InfoLogger} from "./logger";

export enum JobType {
  CREATE_FOLDER = "CREATE_FOLDER",
  UPLOAD = "UPLOAD",
  MOVE = "MOVE",
  COPY = "COPY",
  DELETE = "DELETE",
  LIST_FILES = "LIST_FILES",
  DOWNLOAD = "DOWNLOAD",
}

export interface JobData {
  items?: {
    id: string;
    pathLower?: string;
  }[];
  formData?: any;
  path?: string;
  name?: string;
  treeId: string;
}

export interface Job {
  id: string;
  jobType: JobType;
  running: boolean;
  startTime: number;
  endTime: number;
  data: JobData;
  status: string;
  reason: string;
}

export const prepDB = async function() {
  try {
    const mongo = await DB;
    const collections = await mongo.db("boxd").listCollections().toArray();

    if(!collections.some(colln => colln === "jobs")) {
      await mongo.db("boxd").createCollection("jobs");
    }

    InfoLogger.log({
      level: "Info",
      message: "Jobs collection created successfully"
    });
  } catch (error) {
    ErrorLogger.log({
      level: "Error",
      message: error
    });
  }
};

export const addJob = async function(job: Job) {
  try {
    const mongo = await DB;
    const collection = await mongo.db("boxd").collection("jobs");

    await collection.insert(job);

    InfoLogger.log({
      level: "Info",
      message: "Connected to Mongo DB"
    });
  } catch (error) {
    ErrorLogger.log({
      level: "Error",
      message: error
    });
  }
};

export const removeJob = async function(uiJobId: string) {
  try {
    const mongo = await DB;
    const collection = await mongo.db("boxd").collection("jobs");

    await collection.remove({
      uiJobId,
    });

    InfoLogger.log({
      level: "Info",
      message: `Removed Job ${uiJobId}`
    });
  } catch (error) {
    ErrorLogger.log({
      level: "Error",
      message: error
    });
  }
};

export const removeAllJobs = async function() {
  try {
    const mongo = await DB;
    const collection = await mongo.db("boxd").collection("jobs");

    await collection.remove({});

    InfoLogger.log({
      level: "Info",
      message: `Jobs collection cleared`
    });
  } catch (error) {
    ErrorLogger.log({
      level: "Error",
      message: error
    });
  }
};


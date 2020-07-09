import { Dropbox } from 'dropbox';
import nodeFetch from 'node-fetch';

export default function (accessToken: string, clientId: string) {
  return new Dropbox({
    accessToken: accessToken,
    clientId: clientId,
    fetch: nodeFetch
  });
};

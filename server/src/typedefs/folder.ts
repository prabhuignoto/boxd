import metadata from './metadata';

const folder = `
  type folder {
    entries: [metadata]
    hasMore: Boolean
    cursor: String
  }

  type entryMetadata {
    tag: String
    id: String
    name: String
    path_lower: String
    path_display: String
  }

  type entry {
    tag: String
    metadata: entryMetadata
  }

  type resxMessage {
    success: Boolean!
    name: String!
  }

  type folderAddedMessage {
    success: Boolean!
    name: String!
    path: String!
    uiJobId: String
  }

  type batchWorkMessage {
    job_id: String!
    status: String!
    error: String
    entries: [entry!]
    job_type: String
    uiJobId: String
  }
  
  input relocationEntry {
    fromPath: String!
    toPath: String!
    id: String!
  }  

  input relocationOptions {
    entries: [relocationEntry!]!
    autorename: Boolean
    uiJobId: String
  }

`;

export default [metadata, folder];

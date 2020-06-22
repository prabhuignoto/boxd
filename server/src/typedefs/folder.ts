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
  }

  type batchWorkMessage {
    job_id: String!
    status: String!
    error: String
    entries: [entry!]
    job_type: String
  }
  
  input relocationEntry {
    from_path: String!
    to_path: String!
    id: String!
  }  

  input relocationOptions {
    entries: [relocationEntry!]!
    autorename: Boolean
  }

`;

export default [metadata, folder];

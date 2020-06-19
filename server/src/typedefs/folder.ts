import metadata from './metadata';

const folder = `
  type folder {
    entries: [metadata!]!
    hasMore: Boolean!
    cursor: String!
  }

  type entryMetadata {
    tag: String
    name: String!
    path_lower: String!
    content_hash: String
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
  }

`;

export default [metadata, folder];

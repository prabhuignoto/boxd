import metadata from './metadata';

const folder = `
  type folder {
    entries: [metadata!]!
    hasMore: Boolean!
    cursor: String!
  }

  type resxMessage {
    success: Boolean!
    name: String!
  }

  type folderAddedMessage {
    success: Boolean!
    name: String!
  }

`;

export default [metadata, folder];

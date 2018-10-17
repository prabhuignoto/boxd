import metadata from "./metadata";

const folder = `
  type folder {
    entries: [metadata!]!
    hasMore: Boolean!
    cursor: String!
  }
`;

export default [metadata, folder];
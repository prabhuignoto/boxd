export default `
type Query {
  listFolder(path: String!, limit: Int!, cursor: String): folder!
  listFolderContinue(cursor: String!): folder!getAccount: Account!
  getSpaceUsage: SpaceUsage!
  search(query: String!): SearchResults!
  downloadFile(path: String!): metadata!
  getPreview(path: String!): metadata!
}
`;

export default `
type Query {
  listFolder(path: String!): folder!
  getAccount: Account!
  getSpaceUsage: SpaceUsage!
  search(query: String!): SearchResults!
  downloadFile(path: String!): metadata!
  getPreview(path: String!): metadata!
}
`;

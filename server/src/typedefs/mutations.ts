export default `
  input deleteBulkOptions {
    paths: [String!]!
    uiJobId: String!
  }

  type Mutation {
    createFolder(path: String!, name: String!, uiJobId: String!): metadata!
    deleteFolder(path: String!): metadata!
    moveResource(fromPath: String!, toPath: String!): metadata!
    copyResource(fromPath: String!, toPath: String!): metadata!
    deleteBulk(options: deleteBulkOptions): Boolean
    moveBulk(options: relocationOptions): Boolean
    copyBulk(options: relocationOptions): Boolean
  }
`;

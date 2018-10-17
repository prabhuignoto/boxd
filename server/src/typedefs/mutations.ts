export default `
  type Mutation {
    createFolder(path: String!, name: String!): metadata!
    deleteFolder(path: String!): metadata!
    moveResource(from_path: String!, to_path: String!): metadata!
    copyResource(from_path: String!, to_path: String!): metadata!
  }
`;
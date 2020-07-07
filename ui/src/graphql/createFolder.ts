import gql from "graphql-tag";

export default gql`
  mutation createFolder($args: CreateFolderArg!) {
    folder: createFolder(args: $args) {
      name
    }
  }
`;

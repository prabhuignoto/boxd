import gql from "graphql-tag";

export default gql`
  query list($args: ListFilesArg!) {
    files: listFolder(args: $args) {
      entries {
        name
        tag
        path_lower
        content_hash
        server_modified
        id
      }
      hasMore
      cursor
    }
  }
`;

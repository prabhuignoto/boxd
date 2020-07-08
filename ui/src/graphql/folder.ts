import gql from "graphql-tag";

export default gql`
  query list($args: ListFilesArg!) {
    files: listFolder(args: $args) {
      entries {
        name
        tag
        size
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

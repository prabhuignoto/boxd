import gql from "graphql-tag";

export default gql`
  query list($path: String!, $limit: Int!, $cursor: String) {
    files: listFolder(path: $path, limit: $limit, cursor: $cursor) {
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
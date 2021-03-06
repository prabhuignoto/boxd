import gql from "graphql-tag";

export default gql`
  query search($query: String!) {
    search(query: $query) {
      matches {
        metadata {
          name
          tag
          id
          server_modified
          size
          path_lower
          content_hash
        }
      }
    }
  }
`;

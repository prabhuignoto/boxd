import gql from "graphql-tag";

export default gql`
  mutation copyResource($fromPath: String!, $toPath: String!) {
    result: copyResource(fromPath: $fromPath, toPath: $toPath) {
      name
    }
  }
`;

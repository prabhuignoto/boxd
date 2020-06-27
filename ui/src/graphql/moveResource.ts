import gql from "graphql-tag";

export default gql`
  mutation moveResource($fromPath: String!, $toPath: String!) {
    result: moveResource(fromPath: $fromPath, toPath: $toPath) {
      name
    }
  }
`;

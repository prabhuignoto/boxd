import gql from "graphql-tag";

export default gql`
  mutation moveResource($args: FilesRelocationArg!) {
    result: moveResource(args: $args) {
      name
    }
  }
`;

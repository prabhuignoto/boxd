import gql from "graphql-tag";

export default gql`
  mutation copyResource($args: FilesRelocationArg!) {
    result: copyResource(args: $args) {
      name
    }
  }
`;

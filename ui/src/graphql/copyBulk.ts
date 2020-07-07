import gql from "graphql-tag";

export default gql`
  mutation copyBulk($args: RelocationBulkArgs!) {
    move: copyBulk(args: $args)
  }
`;

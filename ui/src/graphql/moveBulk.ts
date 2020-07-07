import gql from "graphql-tag";

export default gql`
  mutation moveBulk($args: RelocationBulkArgs!) {
    move: moveBulk(args: $args)
  }
`;

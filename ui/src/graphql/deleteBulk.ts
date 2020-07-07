import gql from "graphql-tag";

export default gql`
  mutation deleteBulk($args: DeleteBulkArgs!) {
    delete: deleteBulk(args: $args)
  }
`;

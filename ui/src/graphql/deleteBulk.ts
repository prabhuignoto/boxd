import gql from "graphql-tag";

export default gql`
  mutation deleteBulk($options: deleteBulkOptions!) {
    delete: deleteBulk(options: $options)
  }
`;

import gql from "graphql-tag";

export default gql`
  mutation copyBulk($options: relocationOptions!) {
    move: copyBulk(options: $options)
  }
`;

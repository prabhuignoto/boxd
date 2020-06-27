import gql from "graphql-tag";

export default gql`
  mutation moveBulk($options: relocationOptions!) {
    move: moveBulk(options: $options)
  }
`;

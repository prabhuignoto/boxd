import gql from "graphql-tag";

export default gql`
  mutation createFolder($path: String!, $name: String!, $uiJobId: String!) {
    folder: createFolder(path: $path, name: $name, uiJobId: $uiJobId) {
      name
    }
  }
`;

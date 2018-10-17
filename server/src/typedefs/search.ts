import metadata from "./metadata";

const SearchResults = `
  type match {
    metadata: metadata!
  }
  type SearchResults {
    matches: [match!]!
    more: Boolean!
    start: Int!
  }
`;

export default [metadata, SearchResults];

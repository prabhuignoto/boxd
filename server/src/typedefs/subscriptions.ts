export default `
  type Subscription {
    fileUploaded: uploadMessage!
    folderDeleted: folderDeletedMessage!
    folderAdded: folderAddedMessage!
  }
`;

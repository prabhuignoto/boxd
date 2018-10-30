export default `
  type Subscription {
    fileUploaded: uploadMessage!
    resxDeleted: resxMessage!
    resxMoved: resxMessage!
    resxCopied: resxMessage!
    folderAdded: folderAddedMessage!
  }
`;

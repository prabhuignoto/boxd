export default `
  type Subscription {
    fileUploaded: uploadMessage!
    resxDeleted: resxMessage!
    resxMoved: resxMessage!
    resxCopied: resxMessage!
    folderAdded: folderAddedMessage!
    batchWorkComplete: batchWorkMessage!
    batchWorkRunning: batchWorkMessage!
    batchWorkFailed: batchWorkMessage!
  }
`;

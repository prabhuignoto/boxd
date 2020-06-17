const getFileName = function (path) {
  return path.split("/").pop();
};

export { getFileName };

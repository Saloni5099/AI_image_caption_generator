const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');

let gridFSBucket;

const initGridFS = () => {
  const connection = mongoose.connection.db;
  gridFSBucket = new GridFSBucket(connection, {
    bucketName: 'images'
  });
  return gridFSBucket;
};

const getGridFS = () => {
  if (!gridFSBucket) {
    return initGridFS();
  }
  return gridFSBucket;
};

module.exports = {
  initGridFS,
  getGridFS
};


const crypto = require("crypto");

function createObjectKey(userId, originalName) {
  const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, "_"); //cleans file name

  return `${userId}/${crypto.randomUUID()}-${safeName}`;
}

function createThumbnailKey(objectKey) {
  return objectKey.replace(/\/([^/]+)$/, "/thumb-$1");
}

function isImage(mimeType) {
  return mimeType.startsWith("image/");
}

module.exports = {
  createObjectKey,
  createThumbnailKey,
  isImage
};
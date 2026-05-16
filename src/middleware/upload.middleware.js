const multer = require("multer");
const ApiError = require("../utils/apiError");

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
  "text/plain"
];

const fileFilter = (req, file, cb) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(
      new ApiError(
        400,
        "Unsupported file type. Allowed types: JPEG, PNG, WEBP, PDF, TXT"
      )
    );
  }

  cb(null, true);
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024
  }
});

module.exports = upload;
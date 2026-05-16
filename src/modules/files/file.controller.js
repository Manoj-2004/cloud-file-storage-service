const asyncHandler = require("../../utils/asyncHandler");
const ApiError = require("../../utils/apiError");
const fileService = require("./file.service");

exports.uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "File is required");
  }

  const file = await fileService.uploadFile(req.user.id, req.file);

  res.status(201).json({
    success: true,
    message: "File uploaded successfully",
    data: file
  });
});

exports.listFiles = asyncHandler(async (req, res) => {
  const { page, limit } = req.validated.query;

  const result = await fileService.listFiles(req.user.id, page, limit);

  res.json({
    success: true,
    data: result.files,
    pagination: result.pagination
  });
});

exports.getDownloadUrl = asyncHandler(async (req, res) => {
  const signedUrl = await fileService.getDownloadUrl(
    req.user.id,
    req.params.id
  );

  res.json({
    success: true,
    data: {
      signedUrl
    }
  });
});

exports.getThumbnailUrl = asyncHandler(async (req, res) => {
  const signedUrl = await fileService.getThumbnailUrl(
    req.user.id,
    req.params.id
  );

  res.json({
    success: true,
    data: {
      signedUrl
    }
  });
});

exports.deleteFile = asyncHandler(async (req, res) => {
  await fileService.deleteFile(req.user.id, req.params.id);

  res.json({
    success: true,
    message: "File deleted successfully"
  });
});
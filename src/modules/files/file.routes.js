const router = require("express").Router();
const authMiddleware = require("../../middleware/auth.middleware");
const upload = require("../../middleware/upload.middleware");
const fileController = require("./file.controller");

router.use(authMiddleware);

router.post("/upload", upload.single("file"), fileController.uploadFile);
router.get("/", fileController.listFiles);
router.get("/:id/download-url", fileController.getDownloadUrl);
router.get("/:id/thumbnail-url", fileController.getThumbnailUrl);
router.delete("/:id", fileController.deleteFile);

module.exports = router;
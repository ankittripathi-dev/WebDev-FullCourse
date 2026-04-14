const express = require("express");
const router = express.Router()
const authMiddleware = require("../middlewares/auth.middleware");
const { createPostController, getUserPostsController } = require("../Controllers/post.controller")
const multer = require("multer");


const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Only allow image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
})


// GET /api/posts [protected] - get user history
router.get('/', authMiddleware, getUserPostsController);

// POST /api/posts [protected] {image-file}
router.post('/',
  authMiddleware, // if req is authorized then req.user = userData set kr dega simple or next se req forward ho jyegi
  upload.single("image"),
  createPostController)




module.exports = router;
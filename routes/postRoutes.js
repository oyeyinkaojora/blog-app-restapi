const express = require("express");
const router = express.Router();
const {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
} = require("../controllers/postController");
const { protect } = require("../middlewares/authMiddleware");

router.route("/").get(protect, getPosts).post(protect, createPost);
router
  .route("/:id")
  .get(protect, getPost)
  .delete(protect, deletePost)
  .put(protect, updatePost);

module.exports = router;

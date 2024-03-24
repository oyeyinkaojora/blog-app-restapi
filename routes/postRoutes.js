const express = require("express");
const router = express.Router();
const {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  getMyPosts,
} = require("../controllers/postController");
const { protect } = require("../middlewares/authMiddleware");

router.route("/").get(getPosts).post(protect, createPost);
router.route("/my-posts").get(protect, getMyPosts);
router
  .route("/:id")
  .get(getPost)
  .delete(protect, deletePost)
  .put(protect, updatePost);

module.exports = router;

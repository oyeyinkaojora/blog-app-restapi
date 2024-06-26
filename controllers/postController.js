const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Post = require("../models/postModel");
const Comment = require("../models/commentModel");

const createPost = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    res.status(404);
    throw new Error("Please add Title and Content ");
  }

  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const post = await Post.create({
    title,
    content,
    author: req.user.id,
  });

  return res.status(201).json(post);
});

const getMyPosts = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const posts = await Post.find({ author: req.user.id });
  res.status(200).json(posts);
});

const getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find();
  res.status(200).json(posts);
});

const createComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post does not exist!" });
    }

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "You must be logged in to create a comment.",
      });
    }

    const comment = await Comment.create({
      content: req.body.content,
      post: post._id,
      author: req.user._id,
    });

    post.comments.push(comment._id);
    await post.save();

    return res.status(200).json({ success: true, post, comment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};



const getPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error("Post does not exists!");
  }
  return res.status(200).json(post);
});

const updatePost = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error("Post does not exists!");
  }

  if (post.author.toString() !== req.user.id) {
    res.status(401);
    throw new Error("You're not authorised to update this post");
  }

  const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  return res.status(200).json(updatedPost);
});

const deletePost = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error("Post does not exists!");
  }

  if (post.author.toString() !== req.user.id) {
    res.status(401);
    throw new Error("You're not authorised to delete this post");
  }
  await Post.findByIdAndDelete(req.params.id);

  return res.status(200).json({ message: "Post deleted successfully" });
});

module.exports = {
  createPost,
  getPosts,
  getPost,
  deletePost,
  updatePost,
  getMyPosts,
  createComment,
};

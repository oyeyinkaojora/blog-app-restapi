const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const Post = require("../models/postModel");
const jwt = require("jsonwebtoken");
const { post } = require("../routes/userRoutes");

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

  res.status(201).json(post);
});

const getPosts = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const posts = await Post.find({ author: req.user.id });
  res.status(200).json(posts);
});

const getPost = asyncHandler(async (req, res) => {
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
    throw new Error("Not authorised");
  }
  res.status(200).json(post);
});

module.exports = { createPost, getPosts, getPost };

const express = require("express");
const postroutes = express.Router();
const {
  posts,
  createPosts,
  updatePosts,
  deletePost,
  getFollowingPosts,
} = require("../controllers/postscontrollers");
const postService = require("../middlewares/postAuth");
postroutes.use(postService);
postroutes.get("/posts", posts);
postroutes.get("/posts/followers", getFollowingPosts);
postroutes.post("/posts/create", createPosts);
postroutes.post("/posts/update", updatePosts);
postroutes.delete("/posts/delete", deletePost);

module.exports = postroutes;

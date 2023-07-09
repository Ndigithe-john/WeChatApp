const express = require("express");
const commentsService = require("../middlewares/commentsAuth");
const commentsRoutes = express.Router();
const {
  getPostComments,
  postsComments,
  replyComment,
} = require("../controllers/commentsControllers");
commentsRoutes.use(commentsService);
commentsRoutes.get("/post/:PostID", getPostComments);
commentsRoutes.post("/post/comment", postsComments);
commentsRoutes.post("/post/comment/reply", replyComment);
module.exports = commentsRoutes;

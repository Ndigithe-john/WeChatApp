const express = require("express");
const likesRoute = express.Router();
const postLikes = require("../controllers/likesController");
const commentsService = require("../middlewares/commentsAuth");
likesRoute.use(commentsService);
likesRoute.post("/post/like", postLikes);
module.exports = likesRoute;

const express = require("express");
const postroutes = express.Router();
const posts = require("../controllers/postscontrollers");
postroutes.post("/posts", posts);

module.exports = postroutes;

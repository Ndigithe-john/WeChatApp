const express = require("express");
const followService = require("../middlewares/followAuth");
const {
  follow,
  following,
  followers,
  followSuggestion,
} = require("../controllers/followcontrollers");
const followroute = express.Router();

followroute.use(followService);
followroute.get("/followers", followers);
followroute.get("/following", following);
followroute.post("/follow", follow);
followroute.get("/follow/suggestions", followSuggestion);

module.exports = followroute;

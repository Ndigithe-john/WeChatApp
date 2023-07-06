const express = require("express");
const {
  login,
  signUP,
  forgotPassword,
  resetPassword,
} = require("../controllers/userControllers");
const User = require("../utils/getUser");

const userRoutes = express.Router();

userRoutes.post("/signup", signUP);
userRoutes.post("/login", login);
userRoutes.post("/forgotPassword", forgotPassword);
userRoutes.patch("/resetPassword/:token", resetPassword);
module.exports = userRoutes;

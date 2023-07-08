const express = require("express");
const {
  login,
  signUP,
  forgotPassword,
  resetPassword,
  profileUpdate,
} = require("../controllers/userControllers");

const manageSessions = require("../middlewares/userAuthentication");

const userRoutes = express.Router();

userRoutes.post("/signup", signUP);
userRoutes.post("/login", login);
userRoutes.get("/logout", (req, res, next) => {
  req.session.destroy();
  res.send("user logged out");
});
userRoutes.post("/forgotPassword", forgotPassword);
userRoutes.post("/profile", manageSessions, profileUpdate);
userRoutes.patch("/resetPassword/:token", resetPassword);
// userRoutes.use(manageSessions);
module.exports = userRoutes;

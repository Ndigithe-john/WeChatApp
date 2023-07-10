const express = require("express");
const notifications = require("../controllers/notificationsControllers");
const commentsService = require("../middlewares/commentsAuth");
const notificationRoute = express.Router();

notificationRoute.use(commentsService);
notificationRoute.get("/notifications", notifications);

module.exports = notificationRoute;

const AppError = require("../utils/appError");
async function notifications(req, res, next) {
  try {
    const { pool } = req;
    const user = req.user;

    if (pool.connected) {
      const query = `SELECT NotificationType, NotificationMessage, CreatedAt, IsRead FROM Wechat.Notifications WHERE UserID = '${user.UserID}'`;
      const results = await pool.request().query(query);

      res.status(200).json({
        status: "success",
        notifications: results.recordset,
      });
    }
  } catch (error) {
    console.error(error);
    return next(new AppError("Internal server error", 500));
  }
}

module.exports = notifications;

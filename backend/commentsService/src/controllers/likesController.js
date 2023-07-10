const AppError = require("../utils/appError");
const likesValidator = require("../Validator/likesValidator");
async function postLikes(req, res, next) {
  try {
    const { pool } = req;
    const user = req.user;
    const { PostID } = req.body;
    const { value } = likesValidator(req.body);
    if (!PostID) {
      throw new Error("PostID is required.");
    }

    if (pool.connected) {
      const postCheckQuery = `SELECT COUNT(*) AS PostCount FROM Wechat.Posts WHERE PostID = ${PostID}`;
      const postCheckResult = await pool.request().query(postCheckQuery);

      const postCount = postCheckResult.recordset[0].PostCount;

      if (postCount === 0) {
        throw new Error("Post not found.");
      }

      let post_like = await pool
        .request()
        .input("UserID", user.UserID)
        .input("PostID", PostID)
        .execute("TogglePostLike");

      res.status(200).json({
        status: "success",
        message: "Liked Post",
      });
    }
  } catch (error) {
    res.send(error.message);
  }
}

module.exports = postLikes;

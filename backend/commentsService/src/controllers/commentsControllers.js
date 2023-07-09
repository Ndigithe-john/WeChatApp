const AppError = require("../utils/appError");
const {
  commentsValidator,
  replyCommentValidator,
} = require("../Validator/commentsValidator");
async function getPostComments(req, res, next) {
  try {
    const { pool } = req;
    const user = req.user;
    const { PostID } = req.params;

    if (pool.connected) {
      const postQuery = await pool
        .request()
        .input("PostID", PostID)
        .input("UserID", user.UserID)
        .query(
          "SELECT TOP 1 PostID FROM Wechat.Posts WHERE PostID = @PostID AND UserID = @UserID"
        );

      if (postQuery.recordset.length === 0) {
        return res.status(403).json({
          status: "error",
          message: "No post found.",
        });
      }

      const query = await pool
        .request()
        .input("PostID", PostID)
        .execute("Wechat.GetPostCommentsWithUser");

      const comments = query.recordsets[0];

      res.status(200).json({
        status: "success",
        comments: comments,
      });
    } else {
      res.status(500).json({
        status: "error",
        message: "An error occured! Please try again later",
      });
    }
  } catch (error) {
    return next(new AppError("Internal server error"), 500);
  }
}

async function postsComments(req, res, next) {
  try {
    const user = req.user;
    const { pool } = req;
    const { PostID, Comment } = req.body;
    const { value } = commentsValidator(req.body);
    console.log(value);
    if (pool.connected) {
      let comment = await pool
        .request()
        .input("Created_By_UserID", user.UserID)
        .input("PostID", PostID)
        .input("Comment", Comment)
        .execute("CreateComment");

      res.status(200).json({
        status: "success",
        message: "Comment saved successfully",
      });
    }
  } catch (error) {
    res.send(error.message);
    return next(new AppError("Internal Server Error"), 500);
  }
}

async function replyComment(req, res, next) {
  try {
    const reply_body = req.body;
    const { PostID, Comment, ReplyTo } = reply_body;
    const { value } = replyCommentValidator(reply_body);
    const user = req.user;
    const { pool } = req;
    if (pool.connected) {
      let reply_comment = await pool
        .request()
        .input("Created_By_UserID", user.UserID)
        .input("PostID", PostID)
        .input("Comment", Comment)
        .input("ReplyToUserName", ReplyTo)
        .execute("Wechat.AddCommentReply");
      res.status(200).json({
        status: "success",
        Message: `Replied to ${ReplyTo}`,
      });
    }
  } catch (error) {
    res.send(error.message);
  }
}

module.exports = { getPostComments, postsComments, replyComment };

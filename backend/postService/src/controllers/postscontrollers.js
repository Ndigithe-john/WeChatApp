const mssql = require("mssql");
const config = require("../config/dbConfig");
const {
  postValidator,
  updatePostValidator,
  deletePostValidator,
} = require("../validators/postvalidator");
const AppError = require("../../../userAuthServices/src/utils/appError");

async function posts(req, res, next) {
  try {
    const user = req.user;
    const sql = await mssql.connect(config);

    if (sql.connected) {
      let user_posts = await sql
        .request()
        .input("UserID", user.UserID)
        .execute("GetUserPosts");

      res.status(200).json({
        status: "success",
        posts: user_posts.recordsets[0],
      });
    }
  } catch (error) {
    console.log(error);
    return next(
      new AppError(
        "Error retrieving your posts, Please try again after some time"
      )
    );
  }
}
async function createPosts(req, res, next) {
  try {
    const user = req.user;
    const postsbody = req.body;
    const { Caption, MediaURL } = postsbody;
    const { value } = postValidator(postsbody);
    console.log(value);

    const sql = await mssql.connect(config);
    if (sql.connected) {
      const results = await sql
        .request()
        .input("UserID", user.UserID)
        .input("Caption", Caption)
        .input("MediaURL", MediaURL)

        .execute("CreatePost");
      res.status(200).json({
        status: "success",
        message: "Post created successfully",
      });
    }
  } catch (error) {
    res.send(error.message);
  }
}
async function updatePosts(req, res, next) {
  try {
    const update_posts = req.body;
    const { PostID, Caption, MediaURL } = update_posts;
    const { value } = updatePostValidator(update_posts);
    console.log(value);
    const sql = await mssql.connect(config);
    if (sql.connected) {
      const postupdate = await sql
        .request()
        .input("PostID", PostID)
        .input("Caption", Caption)
        .input("MediaURL", MediaURL)
        .execute("UpdatePost");
      res.status(200).json({
        status: "success",
        message: "post updated successfully",
      });
    } else {
      return next(
        new AppError("There was a problem while updating your post"),
        401
      );
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
}
async function deletePost(req, res, next) {
  try {
    const user = req.user;
    const delete_body = req.body;
    const { PostID } = delete_body;
    const { value } = deletePostValidator(delete_body);

    const { pool } = req;
    if (pool.connected) {
      const checkPostQuery = `
        SELECT PostID
        FROM Wechat.Posts
        WHERE PostID = ${PostID} and UserID=${user.UserID}
      `;
      const checkPostResult = await pool
        .request()
        .input("PostID", PostID)
        .query(checkPostQuery);

      if (checkPostResult.recordset.length === 0) {
        return next(new AppError("Post not found"), 404);
      }
      const delete_post = await pool
        .request()
        .input("PostID", PostID)
        .execute("DeletePost");

      res.status(200).json({
        status: "Success",
        message: "Post deleted successfully",
      });
    }
  } catch (error) {
    res.send(error.message);
    return next(
      new AppError("Unable to process your delete request at the moment"),
      500
    );
  }
}

module.exports = { posts, updatePosts, createPosts, deletePost };

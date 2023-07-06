const mssql = require("mssql");
const config = require("../../../userAuthServices/src/config/databaseConfig");
const postValidator = require("../validators/postvalidator");
async function posts(req, res, next) {
  try {
    const postsbody = req.body;
    const { userID, caption, mediaURL } = postsbody;
    const { value } = postValidator(postsbody);
    console.log(value);

    const sql = await mssql.connect(config);
    if (sql.connected) {
      const results = await sql
        .request()
        .input("UserID", userID)
        .input("Caption", caption)
        .input("MediaURL", mediaURL)
        .execute("CreatePost");
      res.status(200).json({
        status: "success",
        message: "Post created successfully",
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
}
module.exports = posts;

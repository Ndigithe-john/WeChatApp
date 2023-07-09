const { error } = require("../../../userAuthServices/src/model/loginUserModel");
const { comments_schema, reply_schema } = require("../model/commentsModel");

async function commentsValidator(body) {
  const comments = comments_schema.validate(body, { abortEarly: false });
  if (comments.error?.details.length) {
    let message = comments.error.details.map((err) => err.message);
    throw new Error(message.join("\n"));
  } else {
    return comments;
  }
}

async function replyCommentValidator(body) {
  const reply_comment = reply_schema.validate(body, { abortEarly: false });
  if (reply_comment.error?.details.length) {
    let message = reply_comment.error.details.map((err) => err.message);
    throw new Error(message.join("\n"));
  } else {
    return reply_comment;
  }
}
module.exports = { commentsValidator, replyCommentValidator };

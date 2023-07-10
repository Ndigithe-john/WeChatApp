const likes_model = require("../model/likeModel");

async function likesValidator(body) {
  const post_likes = likes_model.validate(body, { abortEarly: false });
  if (post_likes.error?.details.length) {
    let message = post_likes.error.details.map((err) => err.message);
    throw new Error(message.join("\n"));
  } else {
    return post_likes;
  }
}

module.exports = likesValidator;

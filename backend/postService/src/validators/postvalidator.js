const createPostSchema = require("../models/postmodel");

function postValidator(body) {
  const createpost = createPostSchema.validate(body, { abortEarly: false });
  if (createpost.error?.details.length) {
    let message = createpost.error?.details.map((err) => err.message);
    throw new Error(message.join("\n"));
  } else {
    return createpost;
  }
}

module.exports = postValidator;

const followSchema = require("../model/followModel");

async function followValidator(body) {
  const follow_user = followSchema.validate(body, { abortEarly: false });
  if (follow_user.error?.details.length) {
    let message = follow_user.error.details.map((err) => err.message);
    throw new Error(message.join("\n"));
  } else {
    return follow_user;
  }
}
module.exports = followValidator;

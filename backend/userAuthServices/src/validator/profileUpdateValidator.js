const profileSchema = require("../model/profileUpdateModal");
function profileValidator(body) {
  const profile_user = profileSchema.validate(body, { abortEarly: false });
  if (profile_user.error?.details.length) {
    let message = profile_user.error.details.map((err) => err.message);
    throw new Error(message.join("\n"));
  } else {
    return profile_user;
  }
}
module.exports = profileValidator;

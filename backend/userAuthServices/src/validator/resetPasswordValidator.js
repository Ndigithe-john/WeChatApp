const resetPasswordModel = require("../model/resetPasswordModel");

function resetPasswordValidator(body) {
  const reset_password = resetPasswordModel.validate(body, {
    abortEarly: false,
  });
  if (reset_password.error?.details.length) {
    let message = reset_password.error?.details.map((err) => err.message);
    throw new Error(message.join("\n"));
  }
  return reset_password;
}
module.exports = resetPasswordValidator;

const userShema = require("../model/loginUserModel");

function loginValidator(body) {
  const login_user = userShema.validate(body, { abortEarly: false });
  if (login_user.error?.details.length) {
    let message = login_user.error.details.map((err) => err.message);
    throw new Error(message.join("\n"));
  } else {
    return login_user;
  }
}
module.exports = loginValidator;

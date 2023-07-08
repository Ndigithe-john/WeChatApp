const joi = require("joi");
const resetPasswordModel = joi
  .object({
    Password: joi.string().required().min(8).max(30),
    Confirm_password: joi.ref("Password"),
  })
  .with("Password", "Confirm_password");

module.exports = resetPasswordModel;

const joi = require("joi");
const createUserSchema = joi
  .object({
    FirstName: joi.string().required().min(3),
    LastName: joi.string().required(),
    UserName: joi.string().required().min(4).max(15),
    Email: joi.string().min(6).required().max(30),
    Password: joi.string().required().min(8).max(30),
    Confirm_password: joi.ref("Password"),
  })
  .with("Password", "Confirm_password");

module.exports = { createUserSchema };

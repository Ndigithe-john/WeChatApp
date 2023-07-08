const joi = require("joi");

const userShema = joi.object({
  Email: joi.string().required(),
  Password: joi.string().required(),
});
module.exports = userShema;

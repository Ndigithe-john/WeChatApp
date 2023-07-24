const joi = require("joi");

const profileSchema = joi.object({
  UserName: joi.string().optional(),
  Email: joi.string().optional(),
  Profile: joi.string().optional(),
  Bio: joi.string().optional(),
});
module.exports = profileSchema;

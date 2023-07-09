const joi = require("joi");

const followSchema = joi.object({
  FollowedUserName: joi.string().required(),
});
module.exports = followSchema;

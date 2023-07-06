const joi = require("joi");
const createPostSchema = joi.object({
  userID: joi.required(),
  caption: joi.required(),
  mediaURL: joi.required(),
});

module.exports = createPostSchema;

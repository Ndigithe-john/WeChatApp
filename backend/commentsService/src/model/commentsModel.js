const joi = require("joi");

const comments_schema = joi.object({
  PostID: joi.number().required(),
  Comment: joi.string().required(),
});
const reply_schema = joi.object({
  PostID: joi.number().required(),
  Comment: joi.string().required(),
  ReplyTo: joi.string().required(),
});
module.exports = { comments_schema, reply_schema };

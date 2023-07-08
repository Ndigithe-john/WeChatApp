const joi = require("joi");

const createPostSchema = joi.object({
  Caption: joi.string().optional(),
  MediaURL: joi.string().required(),
});
const updatePostSchema = joi.object({
  PostID: joi.number().required(),
  Caption: joi.string().optional(),
  MediaURL: joi.string().optional(),
});
const deletePostSchema = joi.object({
  PostID: joi.number().required(),
});
module.exports = { createPostSchema, updatePostSchema, deletePostSchema };

const joi = require("joi");

const likes_model = joi.object({
  PostID: joi.number().required(),
});

module.exports = likes_model;

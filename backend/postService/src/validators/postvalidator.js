const {
  createPostSchema,
  updatePostSchema,
  deletePostSchema,
} = require("../models/postmodel");

function postValidator(body) {
  const createpost = createPostSchema.validate(body, { abortEarly: false });
  if (createpost.error?.details.length) {
    let message = createpost.error?.details.map((err) => err.message);
    throw new Error(message.join("\n"));
  } else {
    return createpost;
  }
}
function updatePostValidator(body) {
  const updatepost = updatePostSchema.validate(body, { abortEarly: false });
  if (updatepost.error?.details.length) {
    let message = updatepost.error.details.map((err) => err.message);
    throw new Error(message.join("\n"));
  }
  return updatepost;
}
function deletePostValidator(body) {
  const deletepost = deletePostSchema.validate(body, { abortEarly: false });
  if (deletepost.error?.details.length) {
    let message = deletepost?.error.details.map((err) => err.message);
    throw new Error(message.join("\n"));
  }
  return deletepost;
}

module.exports = { postValidator, updatePostValidator, deletePostValidator };

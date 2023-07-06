const { createUserSchema } = require("../model/createUserModel");

function createUserValidator(body) {
  const createUser = createUserSchema.validate(body, { abortEarly: false });
  // console.log(Membermember)
  if (createUser.error?.details.length) {
    let message = createUser.error.details.map((err) => err.message);
    // console.log(message.join(" "));
    throw new Error(message.join("\n"));
  } else {
    return createUser;
  }
}

module.exports = createUserValidator;

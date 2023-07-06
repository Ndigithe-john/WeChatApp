const { tokenVerifier } = require("../utils/getUser");
async function tokenValMiddleware(req, res, next) {
  let token = req.headers["authorization"].split(" ")[1];
  try {
    if (!token)
      return next({ status: 400, message: "Provide a token to proceed" });
    let user = await tokenVerifier(token);
    if (member.roles === "admin") {
      req.member = member;
      next();
    }
  } catch (error) {
    next({ status: 401, message: error.message });
  }
}
module.exports = tokenValMiddleware;

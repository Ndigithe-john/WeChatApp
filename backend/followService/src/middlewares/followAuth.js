const { createClient } = require("redis");

const AppError = require("../Utils/appError");

async function followService(req, res, next) {
  try {
    const redis_client = createClient();
    redis_client.connect();
    redis_client.on("connect", () => console.log("Drive us home chief"));
    let cookie = req.headers["cookie"];
    if (cookie) {
      let sessionID = cookie.substring(16, 52);
      let session = await redis_client.get(sessionID);
      let our_session = JSON.parse(session);
      const authorized = our_session?.authorized;
      if (session && authorized) {
        const userSession = JSON.parse(session);
        const { user } = userSession;
        req.user = user;
        next();
      }
    } else {
      res.status(403).json({
        status: "false",
        message: "Login to proceed",
      });
    }
  } catch (error) {
    return next(new AppError("Error connecting to server"), 500);
  }
}
module.exports = followService;

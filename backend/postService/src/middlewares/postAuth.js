const { default: RedisStore } = require("connect-redis");
const { createClient } = require("redis");
async function postService(req, res, next) {
  try {
    const redis_client = createClient();
    redis_client.connect();
    redis_client.on("connect", () => console.log("redis connected"));
    let cookie = req.headers["cookie"];
    let sessionID = cookie.substring(16, 52);
    console.log(sessionID);
    let session = await redis_client.get(sessionID);
    let current_session = JSON.parse(session);
    const authorized = current_session?.authorized;
    console.log(authorized);
    if (session && authorized) {
      const userSession = JSON.parse(session);
      const { user } = userSession;
      req.user = user;

      next();
    } else {
      res.status(403).json({
        status: "false",
        message: "login to proceed",
      });
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = postService;

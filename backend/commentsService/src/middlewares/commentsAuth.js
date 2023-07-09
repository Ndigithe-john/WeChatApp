const { createClient } = require("redis");

async function commentsService(req, res, next) {
  try {
    const redis_client = createClient();
    redis_client.connect();
    redis_client.on("connect", () => console.log("Dived right in"));
    let cookie = req.headers["cookie"];
    if (cookie) {
      let sessionID = cookie.substring(16, 52);
      let session = await redis_client.get(sessionID);
      let this_session = JSON.parse(session);
      let authorized = this_session?.authorized;
      console.log(authorized);
      if (session && authorized) {
        const userSession = JSON.parse(session);
        const { user } = userSession;
        req.user = user;
        next();
      } else {
        res.status(403).json({
          status: "false",
          message: "You are not logged in ",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = commentsService;

const express = require("express");
require("dotenv").config();
const userRoutes = require("./src/routes/userRoutes");
const AppError = require("./src/utils/appError");
const session = require("express-session");
const RedisStore = require("connect-redis").default;
const config = require("./src/config/databaseConfig");
const sql = require("mssql");
const { createClient } = require("redis");
const { v4 } = require("uuid");
const globalErrorHandlers = require("./src/controllers/errorControllers");
const app = express();
app.use(express.json());
async function startServer() {
  const tenHours = 60 * 60 * 10 * 1000;

  try {
    const pool = await sql.connect(config);
    console.log("Connected to database");

    const redis_client = createClient();
    redis_client.connect();
    redis_client.on("connect", () => console.log("Redis connected"));
    const redis_store = new RedisStore({ client: redis_client, prefix: "" });
    app.use((req, res, next) => {
      req.pool = pool;
      next();
    });
    app.use(
      session({
        store: redis_store,
        secret: process.env.SESSION_SECRET,
        saveUninitialized: false,
        genid: () => v4(),
        resave: false,
        rolling: true,
        unset: "destroy",
        cookie: {
          httpOnly: true,
          secure: false,
          maxAge: tenHours,
          domain: "localhost",
        },
      })
    );

    app.get("/", (req, res, next) => {
      req.session.authorized = true;
      req.session.user = "John";
      console.log(req.sessionID);
      res.send("Okay");
    });

    app.use("/users", userRoutes);

    app.all("*", (req, res, next) => {
      next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
    });
    app.use(globalErrorHandlers);

    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Server running on port ${port}`));
  } catch (error) {
    console.log(error);
  }
}
startServer();

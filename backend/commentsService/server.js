const express = require("express");
const mssql = require("mssql");
const cors = require("cors");
require("dotenv").config();
const config = require("./src/config/dbconfig");
const app = express();
const commentsRoutes = require("./src/routes/commentsRoutes");
const globalErrorHandlers = require("./src/controllers/errorControllers");
const AppError = require("./src/utils/appError");
const notificationRoute = require("./src/routes/notificationsRoute");
const likesRoute = require("./src/routes/likesRoutes");

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

async function commentsServer() {
  try {
    let pool = await mssql.connect(config);
    app.use((req, res, next) => {
      req.pool = pool;
      next();
    });
    app.use("/users", likesRoute);
    app.use("/users", commentsRoutes);
    app.use("/users", notificationRoute);
    app.all("*", (req, res, next) => {
      next(new AppError(`Can't find ${req.originalUrl} on this server`));
    });
    app.use(globalErrorHandlers);
    const port = process.env.PORT || 2020;
    app.listen(port, () => console.log(`Server is running on port ${port}`));
  } catch (error) {
    console.log(error);
  }
}
commentsServer();

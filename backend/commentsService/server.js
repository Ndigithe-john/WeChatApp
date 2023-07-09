const express = require("express");
const mssql = require("mssql");
require("dotenv").config();
const config = require("./src/config/dbconfig");
const app = express();
const commentsRoutes = require("./src/routes/commentsRoutes");
const globalErrorHandlers = require("./src/controllers/errorControllers");
const AppError = require("./src/utils/appError");
app.use(express.json());

async function commentsServer() {
  try {
    let pool = await mssql.connect(config);
    app.use((req, res, next) => {
      req.pool = pool;
      next();
    });
    app.use("/users", commentsRoutes);
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

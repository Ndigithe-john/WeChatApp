const express = require("express");
require("dotenv").config();
const AppError = require("./src/utils/appError");
const globalErrorHandlers = require("./src/controllers/errorController");
const app = express();
const postroutes = require("./src/routes/postsroutes");
const sql = require("mssql");
const config = require("./src/config/dbConfig");

app.use(express.json());

async function postServer() {
  try {
    let pool = await sql.connect(config);
    console.log(pool.connected);
    app.use((req, res, next) => {
      req.pool = pool;
      next();
    });
    app.use("/users", postroutes);
    app.all("*", (req, res, next) => {
      next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
    });
    app.use(globalErrorHandlers);
    const port = process.env.PORT || 3001;
    app.listen(port, () => console.log(`Server running on port ${port}`));
  } catch (error) {
    return next(new AppError("Unable to access server"), 500);
  }
}
postServer();

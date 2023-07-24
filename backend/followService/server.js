const express = require("express");
const config = require("./src/config/dbconfig");
const AppError = require("./src/Utils/appError");
const globalErrorHandlers = require("./src/controllers/errorControllers");
const mssql = require("mssql");
const cors = require("cors");
const followroute = require("./src/routes/followRoutes");

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

async function followerServer() {
  try {
    const pool = await mssql.connect(config);
    const port = process.env.PORT || 3000;
    console.log(pool.connected);
    app.use((req, res, next) => {
      req.pool = pool;
      next();
    });
    app.use("/users", followroute);
    app.all("*", (req, res, next) => {
      next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
    });
    app.use(globalErrorHandlers);

    app.listen(port, () => console.log(`Server running on port ${port}`));
  } catch (error) {
    return next(new AppError(`Ther is an error ${error}`), 400);
  }
}
followerServer();

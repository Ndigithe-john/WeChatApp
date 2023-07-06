const express = require("express");
require("dotenv").config();
const userRoutes = require("./src/routes/userRoutes");
const AppError = require("./src/utils/appError");
const session = require("express-session");
const { v4 } = require("uuid");
const globalErrorHandlers = require("./src/controllers/errorControllers");
const app = express();
app.use(express.json());
const tenHours = 60 * 60 * 10 * 1000;

app.use("/", userRoutes);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    genid: () => v4(),
    resave: true,
    rolling: true,
    cookie: {
      httpOnly: true,
      secure: true,
      maxAge: tenHours,
    },
  })
);
app.get("/", (req, res, next) => {
  console.log(req.sessionID);
  res.send("Okay");
});
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
app.use(globalErrorHandlers);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));

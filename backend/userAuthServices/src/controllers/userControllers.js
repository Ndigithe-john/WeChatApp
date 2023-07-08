const mssql = require("mssql");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const moment = require("moment");
require("dotenv").config();
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const sendMail = require("../utils/email");
const config = require("../config/databaseConfig");
const createUserValidator = require("../validator/createUserValidator");
const User = require("../utils/getUser");
const loginValidator = require("../validator/loginValidator");
const resetPasswordValidator = require("../validator/resetPasswordValidator");
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

async function signUP(req, res) {
  try {
    let newUser = req.body;
    const { pool } = req;
    let { FirstName, LastName, UserName, Email, Password } = newUser;
    // const token = signToken(newUser.UserID);
    let { value } = createUserValidator(newUser);
    let hashed_password = await bcrypt.hash(Password, 8);

    if (sql.connected) {
      let results = await pool
        .request()
        .input("FirstName", FirstName)
        .input("LastName", LastName)
        .input("UserName", UserName)
        .input("Email", Email)
        .input("Password", hashed_password)
        .execute("CreateUser");

      res.status(201).json({
        status: "success",
        Message: "User Created Successfully, Please login to continue",
      });
    }
  } catch (error) {
    console.log(error.message);
    res.send(error.message);
  }
}

async function login(req, res, next) {
  try {
    const login_body = req.body;
    const { pool } = req;
    const { value } = loginValidator(login_body);
    const { Email, Password } = login_body;
    console.log(value);
    let user = await User(Email, pool);
    console.log(user);
    if (user) {
      let password_match = await bcrypt.compare(Password, user.Password);
      if (password_match) {
        // let token = signToken(user.UserID);
        req.session.authorized = true;
        req.session.user = user;

        res.json({
          status: "success",
          message: "Logged in successfully",
        });
      } else {
        return next(new AppError("Incorrect email or passsword"), 401);
      }
    }

    if (!Email || !Password) {
      return next(new AppError("Please provide both email and password"), 400);
    }
    if (!user) {
      return next(new AppError("Incorrect email or password"), 401);
    }
  } catch (error) {
    res.send(error.message);
  }
}

async function forgotPassword(req, res, next) {
  const { Email } = req.body;

  try {
    const sql = await mssql.connect(config);

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    // console.log(hashedResetToken);
    const query = `
      UPDATE Wechat.Users
      SET resetPassword = '${hashedResetToken}',
          resetPasswordExpires = DATEADD(HOUR, 1, GETDATE()) 
      WHERE Email = '${Email}';
    `;
    const result = await sql.query(query);
    console.log(hashedResetToken);
    console.log(resetToken);
    if (result.rowsAffected[0]) {
      const resetURL = `${req.get("host")}/users/resetPassword/${resetToken} `;
      const message = `forgot your password? submit a PATCH request with the new password and passwordConfirm to ${resetURL}.\n If you didn't forget your password, please igore this email`;
      console.log(resetURL);
      try {
        await sendMail({
          email: Email,
          subject: `Your password reset token is only valid for 10 minutes`,
          message,
        });
        res.status(200).json({
          status: "success",
          message: "Token sent to email",
        });
      } catch (error) {
        // user.resetPassword = undefined;
        // user.resetPasswordExpires = undefined;
        console.log(error);
        return next(
          new AppError("There was an error sending the email. Try again later"),
          500
        );
      }
    }

    if (result.rowsAffected[0] === 0) {
      return next(new AppError("There is no user with the email address"), 404);
    }

    console.log("Reset token saved in the database.");
  } catch (error) {
    console.log(error);
    next(error);
  }
}
async function resetPassword(req, res, next) {
  try {
    const currentDate = moment().format("MMM  D YYYY  h:mmA");

    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
    const reset_body = req.body;

    const { newPassword, confirmPassword } = reset_body;
    let hashed_password = await bcrypt.hash(newPassword, 8);

    if (!newPassword || !confirmPassword) {
      return next(
        new AppError("Please provide both a new password and confirm password"),
        400
      );
    }

    const sql = await mssql.connect(config);

    const query = `
      SELECT * 
     FROM Wechat.Users 
      WHERE resetPassword = @hashedToken
    `;
    const result = await sql
      .request()
      .input("hashedToken", hashedToken)
      .query(query);

    // console.log(result.recordset.length);

    if (result.recordset.length === 0) {
      return next(new AppError("Invalid token"), 400);
    }

    const user = result.recordset[0];

    const resetPasswordExpires = user.resetPasswordExpires;
    console.log(resetPasswordExpires < currentDate);
    console.log(resetPasswordExpires);
    console.log(currentDate);

    if (resetPasswordExpires < currentDate) {
      return next(new AppError("Token has expired"), 400);
    }

    if (newPassword !== confirmPassword) {
      return next(new AppError("Passwords do not match"), 400);
    }

    const updateQuery = `
      UPDATE Wechat.Users
      SET Password = '${hashed_password}',
          resetPassword = NULL,
          resetPasswordExpires = NULL
      WHERE UserID = @userId;
    `;
    const update = await sql
      .request()
      .input("password", user.Password)
      .input("userId", user.UserID)
      .query(updateQuery);

    res.status(200).json({
      status: "success",
      message: "Password reset successful",
    });
    console.log(user);
  } catch (error) {
    res.send(error.message);
  }
}

async function profileUpdate(req, res, next) {
  try {
    const profile_update = req.body;
    const { UserID, UserName, Email, Profile, Bio } = profile_update;
    const sql = await mssql.connect(config);
    if (sql.connected) {
      let update_results = await sql
        .request()
        .input("UserID", UserID)
        .input("UserName", UserName)
        .input("Email", Email)
        .input("ProfilePhoto", Profile)
        .input("Bio", Bio)
        .execute("UpdateUserProfile");

      res.status(200).json({
        status: "success",
        message: "Profile updated sucessfully",
      });
    }
  } catch (error) {
    console.log(error);
    return next(
      new AppError(
        "There was an error updating your profile. Please try again after sometime"
      ),
      400
    );
  }
}

module.exports = {
  signUP,
  login,
  forgotPassword,
  resetPassword,
  profileUpdate,
};

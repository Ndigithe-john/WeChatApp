const AppError = require("../Utils/appError");
const followValidator = require("../validators/followValidators");
async function following(req, res, next) {
  try {
    const { pool } = req;
    const user = req.user;
    if (pool.connected) {
      let user_following = await pool
        .request()
        .input("UserID", user.UserID)
        .execute("Wechat.GetFollowing");
      res.status(200).json({
        status: "success",
        following: user_following.recordsets[0],
      });
    }
  } catch (error) {
    return next(
      new AppError("An error ocuured while retrieving your following "),
      500
    );
  }
}
async function followSuggestion(req, res, next) {
  try {
    const user = req.user;
    const { pool } = req;
    if (pool.connected) {
      let follow_suggestion = await pool
        .request()
        .input("UserID", user.UserID)
        .execute("wechat.GetUnfollowedUsers");
      res.status(200).json({
        status: "success",
        follow_suggestion: follow_suggestion.recordsets[0],
      });
    }
  } catch (error) {
    console.log(error);
    return next(new AppError("Error retrieving your suggestions"), 500);
  }
}
async function follow(req, res, next) {
  try {
    const follow_body = req.body;
    const { FollowedUserName } = follow_body;
    const { value } = followValidator(follow_body);
    console.log(value);
    const user = req.user;
    const { pool } = req;
    if (pool.connected) {
      const usernameCheck = await pool
        .request()
        .input("FollowedUserName", FollowedUserName)
        .query(
          `SELECT UserID FROM Wechat.Users WHERE UserName = '${FollowedUserName}'`
        );

      if (usernameCheck.recordset.length === 0) {
        return res.status(404).json({
          status: "error",
          message: `User '${FollowedUserName}' does not exist.`,
        });
      }

      const followedUserID = usernameCheck.recordset[0].UserID;

      if (user.UserID === followedUserID) {
        return res.status(400).json({
          status: "error",
          message: "You cannot follow/unfollow yourself.",
        });
      } else {
        const followRecordCheck = await pool
          .request()
          .input("FollowingUserID", user.UserID)
          .input("FollowedUserID", followedUserID)
          .query(
            `SELECT 1 FROM Wechat.Follower WHERE FollowingUserID = @FollowingUserID AND FollowedUserID = @FollowedUserID`
          );
        console.log(followRecordCheck);
        let message = "";

        if (followRecordCheck.recordset.length === 0) {
          await pool
            .request()
            .input("FollowingUserID", user.UserID)
            .input("FollowedUserName", FollowedUserName)
            .execute("Wechat.ToggleFollowUser");

          message = `You have started following ${FollowedUserName}.`;
        } else {
          await pool
            .request()
            .input("FollowingUserID", user.UserID)
            .input("FollowedUserName", FollowedUserName)
            .execute("Wechat.ToggleFollowUser");

          message = `Unfollowed ${FollowedUserName} successfully.`;
        }

        res.status(200).json({
          status: "success",
          message: message,
        });
      }
    }
  } catch (error) {
    res.send(error.message);
  }
}

async function followers(req, res, next) {
  try {
    const { pool } = req;
    const user = req.user;
    if (pool.connected) {
      let user_followers = await pool
        .request()
        .input("UserID", user.UserID)
        .execute("Wechat.GetFollowers");

      res.status(200).json({
        status: "success",
        followers: user_followers.recordsets[0],
      });
    }
  } catch (error) {
    console.log(error);
    return next(
      new AppError("An error occured while retrieving your followers"),
      500
    );
  }
}
module.exports = { follow, following, followers, followSuggestion };

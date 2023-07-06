CREATE PROCEDURE Wechat.GetUser
  @UserID INT
AS
BEGIN
  SELECT *
  FROM Wechat.Users
  WHERE UserID = @UserID;
END;
EXEC Wechat.GetUser @UserID = 1; -- Replace '1' with the desired UserID
CREATE PROCEDURE Wechat.GetUserByEmail
  @Email VARCHAR(255)
AS
BEGIN
  SELECT *
  FROM Wechat.Users
  WHERE Email = @Email;
END;
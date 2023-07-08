function manageSessions(req, res, next) {
  const authorized = req.session?.authorized;
  if (req.session && authorized) {
    console.log(req.session);
    next();
  } else {
    res.status(401).send("Login to continue");
  }
}

module.exports = manageSessions;

const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
module.exports = function(req, res, next) {
  const token = req.header("auth-header");
  if (!token) return res.status(401).send("Access Denied");
  try {
    const verifiedToken = jwt.verify(token, keys.secretKey);
    req.user = verifiedToken;
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
};

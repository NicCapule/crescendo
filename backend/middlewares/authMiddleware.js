const jwt = require("jsonwebtoken");
const SECRET_KEY = "your_secret_key";

const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  //-------------------------------------------------------------//
  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized. No token provided." });
  }
  //-------------------------------------------------------------//
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized. Invalid token." });
  }
};

//================================================================================//
const authorizeRole = (allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: "Forbidden. Access denied." });
  }
  next();
};

module.exports = { authenticateUser, authorizeRole };

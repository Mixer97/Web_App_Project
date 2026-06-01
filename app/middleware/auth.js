const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies["token"];
  if (!token) {
    res.status(403).json({ msg: "Authentication failed" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ msg: "Not authorized" });
    return;
  }
};

module.exports = verifyToken;

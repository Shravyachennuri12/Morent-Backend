const jwt = require("jsonwebtoken");
<<<<<<< HEAD

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from headers

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user data to request
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
=======
const User = require("../model/user.model");

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach user info to req
    req.user = {
      user_id: user._id,
      name: user.fullName,
      phoneNumber: user.phoneNumber,
      email: user.email,
    };
    console.log("middleware", req.user);
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
>>>>>>> f652a3c (new)
  }
};

module.exports = verifyToken;

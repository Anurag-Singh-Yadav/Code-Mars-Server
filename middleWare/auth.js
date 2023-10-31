const jwt = require("jsonwebtoken");
require("dotenv").config();
// authorisation for checking the validity of token

exports.auth = async(req, res, next) => {
  try {
    const token =
      req.body.token ||
      req.cookies.token ||
      req.header("Authorization").replace("Bearer ", "");
      // console.log(token);
    if (!token) {
      return res.status(403).json({
        status: false,
        message: "token not found",
      });
    }

    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decode;
      // console.log(decode);
      next();  
    } catch (e) {
      return res.status(503).json({
        success: false,
        message:"error in decoding token",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "error in decoding token",
    });
  }
};

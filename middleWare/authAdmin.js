const jwt = require("jsonwebtoken");
require("dotenv").config();
// authorisation for checking the validity of token

exports.auth = (req, res, next) => {
  try {
    const token =
      req.body.token ||
      req.cookies.token ||
      req.header("Authorization").replace("Bearer ", "");
    if (!token) {
      return res.status(403).json({
        status: false,
        message: "token not found",
      });
    }

    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET_ADMIN);
      req.admin = decode;
      // console.log(decode);
      next();  

    } catch (e) {
      return res.status(503).json({
        success: false,
        message:"error in decoding token of admin",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "error in decoding token of admin",
    });
  }
};

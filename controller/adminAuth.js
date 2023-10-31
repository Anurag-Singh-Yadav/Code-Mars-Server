const admin = require("../model/adminSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require('dotenv').config();
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        success: false,
        message: "email and password are required",
      });
    }
    const adminExist = await admin.findOne({ email });
    if (!adminExist) {
      return res.status(401).json({
        success: false,
        message: "You do not have permission to this admin page",
      });
    }
    if (await bcrypt.compare(password, adminExist.password)) {
      // Password match
      // console.log('password matched');
      const payload = {
        user: adminExist.email, // Corrected variable name
        id: adminExist._id, // Corrected variable name
      };
      // console.log(payload);
      let token = jwt.sign(payload, process.env.JWT_SECRET_ADMIN, {
        expiresIn: "2h",
      });
      // console.log(token);
      // adminExist = adminExist.toObject();
      adminExist.token = token;
      adminExist.password = undefined;
      // console.log(adminExist);
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      };

      return res.cookie("token", token, options).status(200).json({
        success: true,
        token: token,
        admin: adminExist,
        message: "Logged in successfully",
      });
    } else {
      return res
        .status(403)
        .json({ success: false, message: "Password does not match" });
    }
  } catch (e) {
    return res.status(403).json({
      success: false,
      message: "error in admin login section",
      error: e,
    });
  }
};

exports.addAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log(req.body);
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "email and password are required",
      });
    }

    const exitAdmin = await admin.findOne({ email });
    // console.log(exitAdmin)
    if (exitAdmin) {
      return res.status(403).json({
        status: false,
        message: "You already have an account with this email",
      });
    }

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (e) {
      // console.log("error in hashing the password", e);
      return res.status(403).json({
        status: false,
        message: "Error in hashing the password",
      });
    }

    const newAdmin = await admin.create({email: email, password: hashedPassword});
    return res.status(200).json({
      success: true,
      newAdmin: newAdmin,
    });

  } catch (e) {
    // console.log("error in admin creation ", e);
    return res.status(400).json({
      success: false,
      message: "Error in admin creation",
    });
  }
};

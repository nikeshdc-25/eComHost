import User from "../models/userModel.js";
import createToken from "../utils/tokenUtil.js";
import asyncHandler from "../middleware/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import { isEmail, isPhone, isStrong } from "../utils/validator.js";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";

//@desc register new user
//route /api/v1/user/signup
//@access public
const signup = asyncHandler(async (req, res, next) => {
  let { email, password, primaryPhone } = req.body;
  let userExists = await User.findOne({ email }); //{email(from userSchema): useremail(from frontend)}
  if (!isEmail(email)) {
    throw new ApiError(404, "Invalid Email!");
  }
  if (!isStrong(password)) {
    throw new ApiError(
      404,
      "Must include 1 Uppercase, Symbols and 1 Number in your password!"
    );
  }
  if (!isPhone(primaryPhone)) {
    throw new ApiError(404, "Use valid phone number!");
  }
  if (userExists) {
    let err = new Error(`User with email ${email} already exists!`);
    err.status = 400; //400 for bad requests
    throw err;
  }
  // let salt = await bcrypt.genSalt(10);
  // let hashedPassword = await bcrypt.hash(password, salt);
  let user = await User.create(req.body);
  createToken(res, user._id);
  res.send({
    message: "User registered Successfully!",
    user: {
      name: user.username,
      email: user.email,
      primaryPhone: user.primaryPhone,
      isAdmin: user.isAdmin,
    },
  });
});

//@desc login for existing user
//route /api/v1/user/login
//@access public
const login = asyncHandler(async (req, res, next) => {
  let { email, password, rememberMe } = req.body;

  let user = await User.findOne({ email });
  if (!user) {
    let err = new Error(`${email} is not registered!`);
    err.status = 400;
    throw err;
  }

  if (await user.matchPassword(password)) {
    let tokenExpiration = rememberMe ? "30d" : "7d";

    createToken(res, user._id, tokenExpiration);
    res.send({
      message: "Login Successful!",
      user: {
        name: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        primaryPhone: user.primaryPhone,
      },
    });
  } else {
    let err = new Error("Invalid Password!");
    err.status = 400;
    throw err;
  }
});

//@desc logout user
//route /api/v1/user/logout
//@access private
const logout = asyncHandler(async (req, res) => {
  res.clearCookie("jwt");
  res.send({ message: "Logout Successfully!" });
});

//@desc get  user
//route /api/v1/user/
//@access private
const getUser = asyncHandler(async (req, res) => {
  let users = await User.find({}).select("-password");
  res.send(users);
});

//@desc gets user details
//route /api/v1/user/profile
//@access private
const getUserProfile = asyncHandler(async (req, res) => {
  res.send(req.user);
});

//@desc update user details
//route /api/v1/user/updateprofile
//@access private
const updateProfile = asyncHandler(async (req, res) => {
  let id = req.user._id;
  let user = await User.findById(id);
  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.primaryPhone = req.body.primaryPhone || user.primaryPhone;
    if (req.body.password) {
      //If no password is given, no need to be hashed again.
      user.password = req.body.password; //If new password is given, it should be hashed.
    }
    let updatedUser = await user.save();
    res.send({
      message: "User Updated Successfully!",
      user: {
        name: updatedUser.username,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        primaryPhone: updatedUser.primaryPhone,
      },
    });
  } else {
    throw new ApiError(404, "User not found!");
  }
});

//@desc update user details
//route /api/v1/user/updateuser/:id
//@access private
const updateUser = asyncHandler(async (req, res) => {
  let id = req.params.id;
  let user = await User.findById(id);
  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);
    let updatedUser = await user.save();
    res.send({ message: "User Updated", user: updatedUser });
  } else throw new ApiError(404, "User not found!");
});

//@desc delete user
//route /api/v1/user/deleteuser/:id
//@access private
const deleteUser = asyncHandler(async (req, res) => {
  let id = req.params.id;
  let user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, "User not found!");
  }
  if (user.isAdmin) {
    throw new ApiError(403, "Cannot delete an admin user!");
  }
  await User.findByIdAndDelete(id);
  res.send({ message: "User deleted Successfully!" });
});

//@desc update admin status
//route /api/v1/user/updateuseradmin/:id
//@access private/admin only
const updateUserAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let user = await User.findById(id);

  if (!user) {
    throw new ApiError(404, "User not found!");
  }
  // change admin status
  user.isAdmin = !user.isAdmin;
  await user.save();
  res.send({
    message: `User ${user.isAdmin ? "promoted to" : "demoted from"} admin!`,
  });
});

//@desc update user password via email
//route /api/v1/user/sentotp
//@access private
const sendOtp = asyncHandler(async (req, res) => {
  let { email } = req.body;
  if (!isEmail(email)) {
    throw new ApiError(400, "Invalid Email!");
  }

  let user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, `${email} is not registered!`);
  }
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpExpires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
  await user.save();
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 587,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });
  try {
    const mailOptions = {
      from: "vapournepal@gmail.com",
      to: email,
      subject: "Your OTP for Authentication",
      text: `Your OTP is: ${otp}`,
      html: `<p>Your OTP is: ${otp}</p>`,
    };

    await transporter.sendMail(mailOptions);
    res.send({ message: `OTP sent to ${email}` });
  } catch (error) {
    console.error("Error sending email:", error);
    throw new ApiError(500, "Failed to send OTP.");
  }
});

// @desc Change password after OTP verification
// @route POST /api/v1/user/changepassword
// @access private
const changePassword = asyncHandler(async (req, res) => {
  let { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    throw new ApiError(400, "Email, OTP, and New Password are required");
  }
  let user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  if (user.otp !== otp || user.otpExpires < Date.now()) {
    throw new ApiError(400, "Invalid or expired OTP");
  }
  const isSamePassword = await bcrypt.compare(newPassword, user.password);
  if (isSamePassword) {
    throw new ApiError(400, "Please use different password from your current one!");
  }
  if (!isStrong(newPassword)) {
    throw new ApiError(
      404,
      "Must include 1 Uppercase, Symbols and 1 Number in your password!"
    );
  }
  user.password = newPassword;
  user.otp = undefined;
  user.otpExpires = undefined;

  let updatedUser = await user.save();
  res.send({
    message: "Password Changed!",
  });
});


export {
  signup,
  login,
  logout,
  getUser,
  getUserProfile,
  updateProfile,
  updateUser,
  deleteUser,
  updateUserAdmin,
  sendOtp,
  changePassword,
};

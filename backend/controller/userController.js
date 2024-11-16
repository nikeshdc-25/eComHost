import User from "../models/userModel.js";
import createToken from "../utils/tokenUtil.js";
import asyncHandler from "../middleware/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import { isEmail, isPhone, isStrong } from "../utils/validator.js";
// import bcrypt from "bcryptjs";

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
  if(!isPhone(primaryPhone)){
    throw new ApiError(
      404, "Use valid phone number!"
    );
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
  let { email, password } = req.body;
  let user = await User.findOne({ email });
  if (!user) {
    let err = new Error(`${email} is not registered!`);
    err.status = 400;
    throw err;
  }
  if (await user.matchPassword(password)) {
    createToken(res, user._id);
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

const updateUserAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let user = await User.findById(id);

  if (!user) {
    throw new ApiError(404, "User not found!");
  }
  // change admin status
  user.isAdmin = !user.isAdmin;
  await user.save();
  res.send({ message: `User ${user.isAdmin ? "promoted to" : "demoted from"} admin!` });
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
};

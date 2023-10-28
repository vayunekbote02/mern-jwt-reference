import asyncHandler from "express-async-handler";
import UserModel from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

// ************************************************************************************************
// @desc    Auth user/set token
// route    POST /api/users/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  // res.status(401);
  // throw new Error("Something went wrong");
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });

  if (user && (await user.matchPasswords(password))) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(401);
    throw new Error("Invalid username or password!");
  }
});
// ************************************************************************************************

// ************************************************************************************************
// @desc    Register new user
// route    POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  // res.status(401);
  // throw new Error("Something went wrong");
  const { name, email, password } = req.body;
  const userExists = await UserModel.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await UserModel.create({
    name,
    email,
    password,
  });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});
// ************************************************************************************************

// ************************************************************************************************
// @desc    Logout user
// route    POST /api/users/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
  // res.status(401);
  // throw new Error("Something went wrong");
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "User logged out." });
});
// ************************************************************************************************

// ************************************************************************************************
// @desc    Get user profile
// route    GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  // res.status(401);
  // throw new Error("Something went wrong");
  const user = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  };

  res.status(200).json(user);
});
// ************************************************************************************************

// ************************************************************************************************
// @desc    Update user profile
// route    PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  // res.status(401);
  // throw new Error("Something went wrong");
  const user = await UserModel.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found.");
  }
});
// ************************************************************************************************

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
};

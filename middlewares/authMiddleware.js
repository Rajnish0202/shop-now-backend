const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const isAuth = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.cookies;

  try {
    if (refreshToken) {
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
      const user = await User.findById(decoded?.id);
      req.user = user;
      next();
    }
  } catch (error) {
    throw new Error('Not Authorized token expired, Please Login again');
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  const { email } = req.user;
  const adminUser = await User.findOne({ email });
  if (adminUser.role !== 'admin') {
    throw new Error('You are not an admin');
  } else {
    next();
  }
});

module.exports = { isAuth, isAdmin };

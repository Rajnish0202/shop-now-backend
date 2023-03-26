const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const { generateToken } = require('../utils/jwtToken');
const validateMongoDbId = require('../utils/validateMongodbId');
const { generateRefreshToken } = require('../utils/refreshToken');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const Coupon = require('../models/couponModel');
const Order = require('../models/orderModel');
const uniqid = require('uniqid');

// Create A User
const createUser = asyncHandler(async (req, res) => {
  const { firstname, lastname, email, mobile, password } = req.body;

  // Validation
  if (!firstname || !lastname || !email || !mobile || !password) {
    res.status(400);
    throw new Error('Please fill in all required fields');
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error('Password must be up to 6 characters.');
  }

  if (mobile.length < 10) {
    res.status(400);
    throw new Error('Mobile Number must be 10 digit.');
  }

  let findUser = await User.findOne({ email });
  findUser = await User.findOne({ mobile });

  if (findUser) {
    // User Already Exists
    res.status(400);
    throw new Error('Email or Mobile has already been registered!');
  }

  // Create User

  const user = await User.create({
    firstname,
    lastname,
    email,
    mobile,
    password,
  });

  // Generate Token
  const refreshToken = await generateRefreshToken(user?._id);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000 * 3),
    // secure: true,
    // sameSite: 'none',
  });

  if (user) {
    res.status(201).json({
      success: true,
      user,
      refreshToken,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// Login A User

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (password.length < 6) {
    res.status(400);
    throw new Error('Password must be up to 6 characters.');
  }

  // Check if user exists or not
  const user = await User.findOne({ email });
  const passwordMatched = await user.isPasswordMatched(password);

  if (user && passwordMatched) {
    const refreshToken = await generateRefreshToken(user?._id);
    await User.findByIdAndUpdate(
      user?._id,
      {
        refreshToken,
      },
      { new: true }
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000 * 3),
      // secure: true,
      // sameSite: 'none',
    });
    res.json({
      success: true,
      _id: user?._id,
      firstname: user?.firstname,
      lastname: user?.lastname,
      email: user?.email,
      mobile: user?.mobile,
      role: user?.role,
      address: user?.address,
      token: generateToken(user?._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid Email or Password!');
  }
});

// Get All Users
const getAllUser = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find();
    res.status(200).json({
      success: true,
      userCounts: getUsers.length,
      getUsers,
    });
  } catch (error) {
    res.status(404);
    throw new error(error);
  }
});

// Get A Single User
const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const getUser = await User.findById(id);

    if (!getUser) {
      res.status(404);
      throw new Error('User Not Found!');
    }

    res.status(200).json({
      success: true,
      getUser,
    });
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

const loadUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req?.user?._id).select('-password');

  if (!user) {
    res.status(404);
    throw new Error('User Not Found!');
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// // Handle Refresh Token

// const handleRefreshToken = asyncHandler(async (req, res) => {
//   const cookie = req.cookies;
//   if (!cookie?.refreshToken) throw new Error('No Refresh Token in Cookies');

//   const refreshToken = cookie.refreshToken;
//   const user = await User.findOne({ refreshToken });
//   if (!user) {
//     res.status(400);
//     throw new Error('No Refresh token present in database or matched.');
//   }

//   jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
//     if (err || user.id !== decoded.id) {
//       res.status(400);
//       throw new Error('There is something wrong with refresh token');
//     }

//     const accessToken = generateToken(user?._id);
//     res.status(200).json({ accessToken });
//   });
// });

// Logout User

const logoutUser = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error('No Refresh Token in Cookies');

  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204);
  }
  await User.findOne(
    { refreshToken },
    {
      refreshToken: '',
    }
  );
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
  });
  return res.sendStatus(204);
});

// Update User
const updateUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { firstname, lastname, mobile, email } = req.body;

  // Validation
  if (!firstname || !lastname || !email || !mobile) {
    res.status(400);
    throw new Error('Please fill in all required fields');
  }

  if (mobile.length < 10) {
    res.status(400);
    throw new Error('Mobile Number must be 10 digit.');
  }

  validateMongoDbId(_id);
  const updateUser = await User.findByIdAndUpdate(
    _id,
    {
      firstname,
      lastname,
      mobile,
      email,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updateUser) {
    res.status(404);
    throw new Error('User Not Found!');
  }

  res.status(200).json({
    success: true,
    updateUser,
  });
});

// Get A Single User
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findByIdAndDelete(id);

  if (!user) {
    res.status(404);
    throw new Error('User Not Found!');
  }

  res.status(200).json({
    success: true,
    message: 'User Deleted Successfully!',
  });
});

// Block User
const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(_id);

  try {
    await User.findByIdAndUpdate(
      id,
      { isBlocked: true },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      success: true,
      message: 'User Blocked.',
    });
  } catch (error) {
    throw new Error(error);
  }
});
const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(_id);

  try {
    await User.findByIdAndUpdate(
      id,
      { isBlocked: false },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      success: true,
      message: 'User UnBlocked.',
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { oldPassword, newPassword, confirmPassword } = req.body;
  validateMongoDbId(_id);

  const user = await User.findById(_id);
  if (!user) {
    res.status(400);
    throw new Error('User Not Found.');
  }

  if (!oldPassword && !newPassword && !confirmPassword) {
    res.status(400);
    throw new Error('All Fields are required.');
  }

  const isPasswordMatched = await user.isPasswordMatched(oldPassword);

  if (!isPasswordMatched) {
    res.status(400);
    throw new Error('Old Password is Incorrect!');
  }

  if (newPassword !== confirmPassword) {
    res.status(400);
    throw new Error('Password does not macthed!');
  }

  if (isPasswordMatched) {
    user.password = newPassword;
    const updatedPassword = await user.save();
    res.status(201).json({
      success: true,
      message: 'Password Updated Successfully.',
      updatedPassword,
    });
  } else {
    res.json(user);
  }
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error('User does not exist!');
  }

  const resetToken = await user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  // Reset Email

  const message = `
  <h2>Hello ${user?.firstname} ${user?.lastname}</h2>
  <p>You requested for a password reset.</p>
  <p>Please use the url below to reset your password.</p>
  <p>This reset link is valid for only 10 minutes.</p>
  <a href=${resetPasswordUrl} clicktracking=off>${resetPasswordUrl}</a>
  <p>Regards...</p>
  <p>ShopNow</p>
  `;

  const subject = 'Password Reset Request.';
  const send_to = user.email;
  const sent_from = process.env.SMPT_MAIL;

  try {
    await sendEmail(subject, message, send_to, sent_from);
    res.status(200).json({
      success: true,
      message: 'Reset Email Sent',
    });
  } catch (error) {
    res.status(500);
    throw new Error('Email not sent, Please tyy again!');
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  // Creating Token Hash

  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error('Reset Password Token is Invalid or has been expired!');
  }

  if (req.body.password !== req.body.confirmPassword) {
    res.status(400);
    throw new Error('Password does not match!');
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    user,
  });
});

const getWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);

  const findWishlist = await User.findById(_id).populate('wishlist');
  if (!findWishlist) {
    res.status(400);
    throw new Error('User does not exixts');
  }

  res.status(200).json({
    success: true,
    findWishlist,
  });
});

// Save User Address
const saveAddress = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  const { street, city, state, country, pin } = req.body;

  if (!street && !city && !state && !country && !pin) {
    res.status(400);
    throw new Error('Please provide all Fields.');
  }

  const address = await User.findByIdAndUpdate(
    _id,
    {
      address: {
        street,
        city,
        state,
        country,
        pinCode: pin,
      },
    },
    { new: true }
  );
  res.status(200).json({
    success: true,
    address,
  });
});

const userCart = asyncHandler(async (req, res) => {
  const { productId, count, color, size } = req.body;
  const { _id } = req.user;
  validateMongoDbId(_id);
  const user = await User.findById(_id);

  if (!user) {
    res.status(400);
    throw new Error('User does not exists!');
  }

  // Check if user already have product in cart
  let cart = await Cart.findOne({ orderby: user._id });
  let getPrice = await Product.findById(productId).select('price').exec();

  if (cart) {
    // cart exists for user
    let itemIndex = cart.products.findIndex(
      (p) => p.product.toString() === productId.toString()
    );

    if (itemIndex > -1) {
      // product exists in the cart, update the count color and size

      let productItem = cart.products[itemIndex];

      productItem.count = count;
      productItem.color = color;
      productItem.size = size;
      productItem.price = getPrice.price;

      cart.products[itemIndex] = productItem;
    } else {
      // product does not exists in the cart, add new items
      cart.products.push({
        product: productId,
        count,
        color,
        size,
        price: getPrice.price,
      });
    }

    const cartTotal = cart.products.reduce((a, b) => a + b.price * b.count, 0);
    cart.cartTotal = cartTotal;

    cart = await cart.save();

    res.status(201).json({
      success: true,
      cart,
    });
  } else {
    // no cart for user,create new cart

    let newCart = await Cart.create({
      products: [
        { product: productId, count, color, size, price: getPrice.price },
      ],
      orderby: user?.id,
    });

    const cartTotal = newCart.products.reduce(
      (a, b) => a + b.price * b.count,
      0
    );

    newCart.cartTotal = cartTotal;
    newCart = await newCart.save();

    res.status(201).json({
      success: true,
      newCart,
    });
  }
});

const getUserCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);

  const cart = await Cart.findOne({ orderby: _id })
    .populate('products.product', 'slug title  price brand type images')
    .populate('products.color')
    .populate('products.size');

  res.status(200).json({
    success: true,
    cart,
  });
});

const emptyCart = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const { _id } = req.user;
  validateMongoDbId(_id);
  let cart = await Cart.updateOne(
    { orderby: _id },
    { $pull: { products: { product: productId } } }
  );

  res.status(200).json({
    success: true,
    cart,
    message: 'Your Cart item removed.',
  });
});

const applyCoupon = asyncHandler(async (req, res) => {
  const { coupon } = req.body;
  const { _id } = req.user;
  validateMongoDbId(_id);
  const vaildCoupon = await Coupon.findOne({ name: coupon });

  if ((vaildCoupon && vaildCoupon.expiry < Date.now()) || !vaildCoupon) {
    res.status(400);
    throw new Error('Invalid or Coupon Expired!');
  }

  let cart = await Cart.findOne({
    orderby: _id,
  }).populate('products.product');

  if (cart === null) {
    res.status(400);
    throw new Error('Your cart is empty. Please add to cart');
  }

  let totalAfterDiscount = (
    cart?.cartTotal -
    cart?.cartTotal * (vaildCoupon.discount / 100)
  ).toFixed(2);

  await Cart.findOneAndUpdate(
    { orderby: _id },
    {
      totalAfterDiscount: totalAfterDiscount,
    },
    { new: true }
  );

  res
    .status(200)
    .json({ success: true, message: 'Coupon Applied Successfully.' });
});

const createOrder = asyncHandler(async (req, res) => {
  const { method, couponApplied } = req.body;
  const { _id } = req.user;
  validateMongoDbId(_id);

  if (method !== 'COD') {
    throw new Error('Only COD is applied.');
  }

  const userCart = await Cart.findOne({ orderby: _id });
  let finalAmount = 0;
  if (couponApplied && userCart.totalAfterDiscount) {
    finalAmount = userCart?.totalAfterDiscount;
  } else {
    finalAmount = userCart?.cartTotal;
  }

  let newOrder = await Order.create({
    products: userCart.products,
    paymentIntent: {
      paymentId: uniqid('COD-'),
      method,
      amount: finalAmount,
      status: 'Cash on Delivery',
      created: Date.now(),
      paid: 'Not Paid',
      currency: 'inr',
    },
    orderby: _id,
    orderStatus: 'Cash on Delivery',
  });

  let update = userCart.products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item.product._id },
        update: { $inc: { quantity: -item.count, sold: +item.count } },
      },
    };
  });

  await Product.bulkWrite(update, {});

  res.status(200).json({
    success: true,
    newOrder,
  });
});

const getOrders = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);

  const myOrders = await Order.find({ orderby: _id })
    .populate('products.product')
    .exec();

  res.status(200).json({
    success: true,
    myOrders,
  });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  validateMongoDbId(id);

  const updateOrderStatus = await Order.findByIdAndUpdate(
    id,
    {
      orderStatus: status,
      paymentIntent: {
        paid: status === 'Delivered' ? 'Paid' : 'Not Paid',
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    success: true,
    updateOrderStatus,
  });
});

module.exports = {
  createUser,
  loginUser,
  getAllUser,
  getUser,
  deleteUser,
  updateUser,
  blockUser,
  unblockUser,
  // handleRefreshToken,
  logoutUser,
  updatePassword,
  forgotPassword,
  resetPassword,
  getWishlist,
  saveAddress,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  createOrder,
  getOrders,
  updateOrderStatus,
  loadUser,
};

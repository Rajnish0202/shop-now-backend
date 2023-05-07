const asyncHandler = require('express-async-handler');
const Coupon = require('../models/couponModel');
const validateMongoDbId = require('../utils/validateMongodbId');

const generateCoupon = asyncHandler(async (req, res) => {
  const newCoupon = await Coupon.create(req.body);
  res.status(201).json({
    success: true,
    newCoupon,
  });
});

const updateCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  const updatedCoupon = await Coupon.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  res.status(200).json({
    success: true,
    updatedCoupon,
  });
});

const deleteCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  await Coupon.findByIdAndDelete(id);
  res.status(200).json({
    success: true,
    message: 'Coupon deleted successfully.',
  });
});

const getAllCoupon = asyncHandler(async (req, res) => {
  let coupons = await Coupon.find();
  // coupons = coupons.filter((coupon) => coupon.expiry >= Date.now());
  res.status(200).json({
    success: true,
    coupons,
  });
});

const getACoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  const coupon = await Coupon.findById(id);
  res.status(200).json({
    success: true,
    coupon,
  });
});

module.exports = {
  generateCoupon,
  updateCoupon,
  deleteCoupon,
  getAllCoupon,
  getACoupon,
};

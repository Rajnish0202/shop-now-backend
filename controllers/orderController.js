const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');
const validateMongoDbId = require('../utils/validateMongodbId');

const getAllOrders = asyncHandler(async (req, res) => {
  const allOrders = await Order.find()
    .populate('products.product')
    .populate('orderby', 'firstname lastname mobile email');

  res.status(200).json({
    success: true,
    allOrders,
  });
});

const getOrderDetails = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  validateMongoDbId(orderId);
  const orderDetails = await Order.findById(orderId)
    .populate('products.product')
    .populate('orderby', 'firstname lastname mobile email');

  res.status(200).json({
    success: true,
    orderDetails,
  });
});

module.exports = {
  getAllOrders,
  getOrderDetails,
};

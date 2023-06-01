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

const getPendingOrders = asyncHandler(async (req, res) => {
  const pendingOrders = await Order.find({ orderStatus: 'Not Processed' })
    .populate('products.product')
    .populate('orderby', 'firstname lastname mobile email')
    .sort({ createdAt: '-1' });

  res.status(200).json({
    success: true,
    pendingOrders,
  });
});

const getShippedOrders = asyncHandler(async (req, res) => {
  const shippedOrders = await Order.find({ orderStatus: 'Shipped' })
    .populate('products.product')
    .populate('orderby', 'firstname lastname mobile email')
    .sort({ updatedAt: '-1' });

  res.status(200).json({
    success: true,
    shippedOrders,
  });
});

const getOutForDeliveryOrders = asyncHandler(async (req, res) => {
  const outForDeliveryOrders = await Order.find({
    orderStatus: 'Out For Delivery',
  })
    .populate('products.product')
    .populate('orderby', 'firstname lastname mobile email')
    .sort({ updatedAt: '-1' });

  res.status(200).json({
    success: true,
    outForDeliveryOrders,
  });
});

const getDeliverdOrders = asyncHandler(async (req, res) => {
  const deliveredOrders = await Order.find({ orderStatus: 'Delivered' })
    .populate('products.product')
    .populate('orderby', 'firstname lastname mobile email')
    .sort({ updatedAt: '-1' });

  res.status(200).json({
    success: true,
    deliveredOrders,
  });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  validateMongoDbId(id);

  const order = await Order.findById(id);
  if (order.paymentIntent.method === 'CashOnDelivery') {
    const updateOrderStatus = await Order.findByIdAndUpdate(
      id,
      {
        orderStatus: status,
        paymentIntent: {
          paymentId: order?.paymentIntent?.paymentId,
          method: order?.paymentIntent?.method,
          status: order?.paymentIntent?.status,
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
  } else {
    const updateOrderStatus = await Order.findByIdAndUpdate(
      id,
      {
        orderStatus: status,
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
  }
});

module.exports = {
  getAllOrders,
  getOrderDetails,
  getPendingOrders,
  getShippedOrders,
  getDeliverdOrders,
  getOutForDeliveryOrders,
  updateOrderStatus,
};

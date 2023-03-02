const asyncHandler = require('express-async-handler');
const Brand = require('../models/brandModel');
const validateMongoDbId = require('../utils/validateMongodbId');

const createBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.create(req.body);

  res.status(201).json({
    success: true,
    brand,
  });
});

const updateBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  const brand = await Brand.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  res.status(201).json({
    success: true,
    brand,
  });
});

const deleteBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  await Brand.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: 'Product Brand Deleted.',
  });
});

const getAllBrand = asyncHandler(async (req, res) => {
  const brands = await Brand.find();

  res.status(200).json({
    success: true,
    brands,
  });
});

const getABrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  const brand = await Brand.findById(id);

  res.status(200).json({
    success: true,
    brand,
  });
});

module.exports = {
  createBrand,
  updateBrand,
  deleteBrand,
  getAllBrand,
  getABrand,
};

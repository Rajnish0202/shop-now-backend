const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodbId');
const slugify = require('slugify');
const Size = require('../models/productSizeModel');

const createSize = asyncHandler(async (req, res) => {
  const { title } = req.body;

  if (!title) {
    res.status(401);
    throw new Error('Size title is required.');
  }

  const existingSize = await Size.findOne({ title });

  if (existingSize) {
    res.status(200);
    throw new Error('Size already exists');
  }

  const size = await Size.create({
    title,
  });

  res.status(201).json({
    success: true,
    size,
  });
});

const updateSize = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const { id } = req.params;
  validateMongoDbId(id);
  const size = await Size.findByIdAndUpdate(
    id,
    { title },
    {
      new: true,
    }
  );

  res.status(201).json({
    success: true,
    size,
  });
});

const deleteSize = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  await Size.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: 'Product Size Deleted.',
  });
});

const getAllSize = asyncHandler(async (req, res) => {
  const sizes = await Size.find()
    .collation({ locale: 'en', strength: 3 })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: sizes.length,
    sizes,
  });
});

//

const getASize = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const size = await Size.findById(id);

  if (!size) {
    res.status(404);
    throw new Error('Size not found.');
  }

  res.status(200).json({
    success: true,
    size,
  });
});

module.exports = {
  createSize,
  updateSize,
  deleteSize,
  getAllSize,
  getASize,
};

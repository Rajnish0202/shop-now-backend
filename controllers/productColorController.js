const asyncHandler = require('express-async-handler');
const Color = require('../models/productColorModel');
const validateMongoDbId = require('../utils/validateMongodbId');

const createColor = asyncHandler(async (req, res) => {
  const { title, hex } = req.body;

  if (!title) {
    res.status(401);
    throw new Error('Color title is required. ');
  }

  if (!hex) {
    res.status(401);
    throw new Error('Color hex code is required. ');
  }

  const existingColor = await Color.findOne({ title });

  if (existingColor) {
    res.status(200);
    throw new Error('Color already exists');
  }

  const color = await Color.create({ title, hex });

  res.status(201).json({
    success: true,
    color,
  });
});

const updateColor = asyncHandler(async (req, res) => {
  const { title, hex } = req.body;
  const { id } = req.params;
  validateMongoDbId(id);

  if (!title) {
    res.status(401);
    throw new Error('Color title is required. ');
  }

  if (!hex) {
    res.status(401);
    throw new Error('Color hex code is required. ');
  }

  const color = await Color.findByIdAndUpdate(
    id,
    { title, hex },
    {
      new: true,
    }
  );

  res.status(200).json({
    success: true,
    color,
  });
});

const deleteColor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  await Color.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: 'Product Color Deleted.',
  });
});

const getAllColor = asyncHandler(async (req, res) => {
  const colors = await Color.find()
    .collation({ locale: 'en', strength: 2 })
    .sort({ title: 1 });

  res.status(200).json({
    success: true,
    count: colors.length,
    colors,
  });
});

//

const getAColor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const color = await Color.findOne({ id });

  if (!color) {
    res.status(404);
    throw new Error('Color not found.');
  }

  res.status(200).json({
    success: true,
    color,
  });
});

module.exports = {
  createColor,
  updateColor,
  deleteColor,
  getAllColor,
  getAColor,
};

const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');
const validateMongoDbId = require('../utils/validateMongodbId');
const slugify = require('slugify');
const User = require('../models/userModel');
const cloudinaryUploadImg = require('../utils/cloudinary');
const fs = require('fs');

// Create Product

const createProduct = asyncHandler(async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      category,
      quantity,
      color,
      brand,
      type,
      sizes,
      special,
    } = req.body;

    // Validation
    switch (true) {
      case !title:
        res.status(400);
        throw new Error('Title is Required.');

      case !description:
        res.status(400);
        throw new Error('Description is Required.');

      case !price:
        res.status(400);
        throw new Error('Price is Required.');

      case !category:
        res.status(400);
        throw new Error('Category is Required.');

      case !quantity:
        res.status(400);
        throw new Error('Quantity is Required.');

      case !color:
        res.status(400);
        throw new Error('Color is Required.');

      case !brand:
        res.status(400);
        throw new Error('Brand is Required.');

      case !type:
        res.status(400);
        throw new Error('Type is Required.');
    }

    let size = [];

    if (typeof sizes === 'string') {
      size.push(sizes);
    } else {
      size = sizes;
    }

    const newProduct = await Product.create({
      title,
      slug: slugify(title),
      description,
      price,
      category,
      quantity,
      color,
      brand,
      type,
      sizes,
      special,
    });

    res.status(201).json({
      success: true,
      newProduct,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Update Product

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const {
      title,
      description,
      price,
      category,
      quantity,
      color,
      brand,
      type,
      sizes,
      special,
    } = req.body;

    // Validation
    switch (true) {
      case !title:
        res.status(400);
        throw new Error('Title is Required.');

      case !description:
        res.status(400);
        throw new Error('Description is Required.');

      case !price:
        res.status(400);
        throw new Error('Price is Required.');

      case !category:
        res.status(400);
        throw new Error('Category is Required.');

      case !quantity:
        res.status(400);
        throw new Error('Quantity is Required.');

      case !color:
        res.status(400);
        throw new Error('Color is Required.');

      case !brand:
        res.status(400);
        throw new Error('Brand is Required.');

      case !type:
        res.status(400);
        throw new Error('Type is Required.');
    }

    let size = [];

    if (typeof sizes === 'string') {
      size.push(sizes);
    } else {
      size = sizes;
    }

    const updateProduct = await Product.findByIdAndUpdate(
      id,
      {
        title,
        slug: slugify(title),
        description,
        price,
        color,
        brand,
        quantity,
        category,
        type,
        sizes,
        special,
      },
      {
        new: true,
      }
    );

    res.status(201).json({
      success: true,
      updateProduct,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Delete Product

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  await Product.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: 'Product Deleted Successfully.',
  });
  try {
  } catch (error) {
    throw new Error(error);
  }
});

// Get A single product

const getAProduct = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  try {
    const product = await Product.findOne({ slug })
      .populate('category')
      .populate('brand')
      .populate('ratings.postedby', 'firstname , lastname')
      .populate('type')
      .populate('sizes', 'title')
      .populate('color', 'title , hex');

    if (!product) {
      res.status(404);
      throw new Error('Product Not Found.');
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Get ALL product

const getAllProduct = asyncHandler(async (req, res) => {
  try {
    // Filtering
    const queryObj = { ...req.query };

    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt|eq)\b/g,
      (match) => `$${match}`
    );

    let query = Product.find(JSON.parse(queryStr));

    if (queryObj.keyword) {
      const keyword = queryObj.keyword
        ? {
            $or: [
              {
                title: {
                  $regex: queryObj.keyword,
                  $options: 'i',
                },
              },
              {
                description: {
                  $regex: queryObj.keyword,
                  $options: 'i',
                },
              },
            ],
          }
        : {};

      query = query.find({ ...keyword });
    }

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Limit the fields
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // Pagination

    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip >= productCount) throw new Error('This page does not exist');
    }

    const totalProducts = await Product.countDocuments();

    const products = await query
      .populate('category')
      .populate('brand')
      .populate('type');

    res.status(200).json({
      success: true,
      productCounts: products.length,
      totalProducts,
      products,
    });
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

// Get Random Product
const randomProduct = asyncHandler(async (req, res) => {
  try {
    const count = await Product.countDocuments();
    const random = Math.floor(Math.random() * count);
    const randomProducts = await Product.find().skip(random).limit(2);
    res.status(200).json({
      success: true,
      randomCount: randomProducts.length,
      randomProducts,
    });
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

// Get Related Product
const getRelatedProduct = asyncHandler(async (req, res) => {
  try {
    const { productid, categoryid } = req.params;
    const products = await Product.find({
      category: categoryid,
      _id: { $ne: productid },
    })
      .limit(5)
      .populate('category');
    res.status(200).json({
      success: true,
      products,
      counts: products.length,
    });
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

// Add to Wishlist

const addToWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { productId } = req.body;

  try {
    const user = await User.findById(_id);
    if (!user) {
      res.status(404);
      throw new Error('User Not Found!');
    }
    const alreadyadded = user.wishlist.find(
      (id) => id.toString() === productId
    );

    if (alreadyadded) {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $pull: { wishlist: productId },
        },
        {
          new: true,
        }
      );
      res.status(200).json({
        success: true,
        user,
      });
    } else {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $push: { wishlist: productId },
        },
        {
          new: true,
        }
      );
      res.status(200).json({
        success: true,
        user,
      });
    }
  } catch (error) {
    throw new Error(error);
  }
});

// Rating Product

const rating = asyncHandler(async (req, res) => {
  const { productId, star, comment } = req.body;
  const { _id } = req.user;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(400);
    throw new Error('Product does not exists.');
  }

  let alreadyRated = product?.ratings?.find(
    (userId) => userId.postedby.toString() === _id.toString()
  );

  try {
    if (alreadyRated) {
      const updateRating = await Product.updateOne(
        {
          ratings: { $elemMatch: alreadyRated },
        },
        {
          $set: { 'ratings.$.star': star, 'ratings.$.comment': comment },
        },
        {
          new: true,
        }
      );
      // res.status(200).json({
      //   success: true,
      //   updateRating,
      // });
    } else {
      const rateProduct = await Product.findByIdAndUpdate(
        productId,
        {
          $push: {
            ratings: {
              star: star,
              comment: comment,
              postedby: _id,
            },
          },
        },
        {
          new: true,
        }
      );
      // res.status(200).json({
      //   success: true,
      //   rateProduct,
      // });
    }

    const getAllRating = await Product.findById(productId);

    let totalrating = getAllRating.ratings.length;
    let ratingSum = getAllRating.ratings
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0);

    let actualRating = Math.round(ratingSum / totalrating);

    let finalProduct = await Product.findByIdAndUpdate(
      productId,
      { totalRating: actualRating },
      { new: true }
    );
    res.status(200).json({
      success: true,
      finalProduct,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Upload Images of Product

const uploadImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const uploader = (path) => cloudinaryUploadImg(path, 300, 300, 'images');
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path);
      urls.push(newPath);
      fs.unlinkSync(path);
    }
    const findProduct = await Product.findByIdAndUpdate(
      id,
      {
        images: urls.map((file) => {
          return file;
        }),
      },
      { new: true }
    );
    res.status(200).json(findProduct);
  } catch (error) {
    throw new Error(error);
  }
});

// Get Products with Max Sold

const popularProducts = asyncHandler(async (req, res) => {
  const { limit } = req.query;
  const popular = await Product.find()
    .sort({ sold: -1 })
    .select('title brand totalRating price images sold slug')
    .populate('brand', 'title')
    .limit(limit || 4);

  let totalPopular = await Product.find();
  totalPopular = totalPopular.filter((item) => item.sold > 1);

  res.status(200).json({
    totalPopular: totalPopular.length,
    popularCount: popular.length,
    popular,
  });
});

// Get Products with Max Sold

const featuredProducts = asyncHandler(async (req, res) => {
  const { limit } = req.query;
  const featured = await Product.find()
    .sort({ createdAt: -1 })
    .select('title brand totalRating price images sold slug createdAt')
    .populate('brand', 'title')
    .limit(limit || 4);

  res.status(200).json(featured);
});

const specialProducts = asyncHandler(async (req, res) => {
  const { limit } = req.query;
  const special = await Product.find({ 'special.isSpecial': true })
    .select('title slug brand totalRating price offer special quantity images')
    .populate('brand', 'title')
    .limit(limit || 4);

  res.status(200).json({
    specialCount: special.length,
    special,
  });
});

module.exports = {
  createProduct,
  getAllProduct,
  getAProduct,
  randomProduct,
  updateProduct,
  deleteProduct,
  addToWishlist,
  rating,
  uploadImages,
  getRelatedProduct,
  popularProducts,
  featuredProducts,
  specialProducts,
};

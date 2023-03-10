const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRouter = require('./routes/userRoute');
const productRouter = require('./routes/productRoute');
const blogRouter = require('./routes/blogRoute');
const productCategoryRouter = require('./routes/productCategoryRoute');
const brandRouter = require('./routes/brandRoute');
const blogCategoryRouter = require('./routes/blogCategoryRoute');
const couponRouter = require('./routes/couponRoute');
const paymentRouter = require('./routes/paymentRoute');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// Router Middleware

app.use('/api/user', authRouter);
app.use('/api/product', productRouter);
app.use('/api/blog', blogRouter);
app.use('/api/category', productCategoryRouter);
app.use('/api/brand', brandRouter);
app.use('/api/blog-category', blogCategoryRouter);
app.use('/api/coupon', couponRouter);
app.use('/api/payment', paymentRouter);

app.use(notFound);
app.use(errorHandler);

// Connect to DB and Start Server
const PORT = process.env.PORT || 5000;
mongoose
  .connect(
    process.env.MONGODB_URI.replace('<PASSWORD>', process.env.MONGODB_PASSWORD)
  )
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running at PORT ${PORT}`);
    });
  })
  .catch((err) => console.log(err));

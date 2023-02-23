const config = require("./utils/config");
const express = require("express");
const blogsRouter = require("./controllers/blogs");
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const app = express();
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const mongoose = require("mongoose");
const cors = require('cors')

mongoose.set("strictQuery", false);

logger.info("connecting to ", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB", error.message);
  });

app.use(express.static("build"));
app.use(express.json());
app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor)
app.use(cors())


app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;

const blogsRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const Blog = require("../models/blog");
const User = require("../models/user");
const mongoose = require("mongoose");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const body = request.body;

  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }
  const user = await User.findById(decodedToken.id);

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.put("/:id", async (request, response) => {
  // console.log('blogsRouter.put', request.body)
  const body = request.body;

  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }
  // const user = await User.findById(decodedToken.id);

  const newBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  Blog.findByIdAndUpdate(body._id, newBlog, { new: true })
    .then((updatedBlog) => {
      // console.log("updated, updatedBlog :", updatedBlog);
      response.status(201).json(updatedBlog);
    })
    .catch((error) => {
      console.log("update fail,", error);
      return response.status(401).json({ error: "update fail!" });
    });
});

module.exports = blogsRouter;

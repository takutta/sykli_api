const jwt = require('jsonwebtoken');
const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .find({})
    .populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  const { title, url } = request.body;
  if (!title || !url) {
    return response
      .status(400)
      .json({ error: 'Title or URL missing' });
  }

  const user = request.user;

  const blogData = request.body;
  blogData.user = user._id;
  const blog = new Blog(blogData);
  const savedBlog = await blog.save();

  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', async (request, response) => {
  const user = request.user;
  const blog = await Blog.findById(request.params.id);
  if (!blog) {
    response.status(404).json({ message: 'Blog not found' });
  } else {
    if (blog.user.toString() === user.id.toString()) {
      const deletedBlog = await Blog.findByIdAndRemove(
        request.params.id,
      );
      if (deletedBlog) {
        response.status(204).json({ message: 'Blog deleted' });
      } else {
        response.status(404).json({ message: 'Blog not found' });
      }
    } else {
      response.status(404).json({
        message:
          '"The blog cannot be deleted since the user is not the creator.',
      });
    }
  }
});

blogsRouter.put('/:id', async (request, response) => {
  const { likes } = request.body;

  const blog = {
    likes: likes,
  };
  const existingBlog = await Blog.findById(request.params.id);

  if (existingBlog.likes === likes) {
    return response
      .status(200)
      .json({ message: 'Likes already set to the specified value.' });
  }
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    blog,
    { new: true },
  );
  response.json(updatedBlog);
});

module.exports = blogsRouter;

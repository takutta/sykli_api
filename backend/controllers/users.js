const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');
const Blog = require('../models/blog');

usersRouter.post('/', async (request, response, next) => {
  const { username, name, password } = request.body;
  if (!password) {
    return response.status(400).json({
      error:
        'User validation failed: password: Path `password` is required.',
    });
  }
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const user = new User({
    username,
    name,
    passwordHash,
  });

  try {
    const savedUser = await user.save();
    response.status(201).json(savedUser);
  } catch (error) {
    next(error);
  }
});

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
    .find({})
    .populate('blogs', { url: 1, title: 1, author: 1 });
  response.json(users);
});

usersRouter.delete('/:id', async (request, response) => {
  const user = await User.findById(request.params.id);
  if (!user) {
    response.status(404).json({ message: 'User not found' });
  } else {
    const deletedUser = await User.findByIdAndRemove(
      request.params.id,
    );
    if (deletedUser) {
      response.status(204).json({ message: 'User deleted' });
    }
  }
});

module.exports = usersRouter;

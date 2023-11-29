const Blog = require('../models/blog');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const initialUsers = [
  {
    username: 'mane',
    name: 'Mauno Ahtisaari',
    password: 'sillisalaatti',
  },
  {
    username: 'sale',
    name: 'Sauli Niinistö',
    password: 'salkkarit',
  },
];

const createInitialUsers = async () => {
  const users = await Promise.all(
    initialUsers.map(async (user) => {
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(
        user.password,
        saltRounds,
      );
      const newUser = new User({
        username: user.username,
        name: user.name,
        passwordHash,
      });

      const savedUser = await newUser.save();

      // Luo ja tallenna token käyttäjälle
      const userForToken = {
        username: savedUser.username,
        id: savedUser._id,
      };
      savedUser.token = jwt.sign(userForToken, process.env.SECRET);

      return savedUser;
    }),
  );
  return users;
};

const initialBlogs = [
  {
    title: 'Uranus',
    author: 'Pekka Metsä',
    url: 'https://www.google.fi',
    likes: 5,
  },
  {
    title: 'Neptunus',
    author: 'Hillevi Hähmälä',
    url: 'https://www.microsoft.fi',
    likes: 10,
  },
];

const createInitialBlogs = async (users) => {
  const firstUser = users[0]; // Valitse ensimmäinen käyttäjä

  const blogs = initialBlogs.map((blog) => {
    return {
      ...blog,
      user: firstUser._id,
    };
  });

  await Blog.insertMany(blogs);
  return blogs;
};

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon' });
  await blog.save();
  await blog.remove();

  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

module.exports = {
  initialUsers,
  createInitialUsers,
  initialBlogs,
  createInitialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
};

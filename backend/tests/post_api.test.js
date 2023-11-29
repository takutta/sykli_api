const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

const Blog = require('../models/blog');
const User = require('../models/user');
const helper = require('./test_helper');

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  // Luo ja tallenna käyttäjät tietokantaan
  const users = await helper.createInitialUsers();

  // Lisää blogeihin user._id:
  const blogs = await helper.createInitialBlogs(users);
});

test('blogs are returned as json', async () => {
  const user = await api
    .post('/api/login')
    .send(helper.initialUsers[0]);

  await api
    .get('/api/blogs')
    .set('Authorization', `Bearer ${user.body.token}`)
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('all blogs are returned', async () => {
  const user = await api
    .post('/api/login')
    .send(helper.initialUsers[0]);

  response = await api
    .get('/api/blogs')
    .set('Authorization', `Bearer ${user.body.token}`);

  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test('returned blogs identifier field is id', async () => {
  const user = await api
    .post('/api/login')
    .send(helper.initialUsers[0]);

  const response = await api
    .get('/api/blogs')
    .set('Authorization', `Bearer ${user.body.token}`);

  const contents = response.body.map((r) => r.id);
  expect(contents).toBeDefined();
});

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'First Blog Post',
    author: 'Test Author',
    url: 'https://www.testurl.com',
    likes: 10,
  };

  const user = await api
    .post('/api/login')
    .send(helper.initialUsers[0]);

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${user.body.token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();

  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
  const titles = blogsAtEnd.map((b) => b.title);
  expect(titles).toContain('First Blog Post');
});

test('if likes not defined, it is 0', async () => {
  const user = await api
    .post('/api/login')
    .send(helper.initialUsers[0]);

  const newBlog = {
    title: 'Mars',
    author: 'Mamma Maatila',
    url: 'https://www.mtv.fi',
  };

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${user.body.token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  const addedBlog = blogsAtEnd.find((blog) => blog.title === 'Mars');
  expect(addedBlog.likes).toBe(0);
});

test('error 400 if title or url undefined', async () => {
  const user = await api
    .post('/api/login')
    .send(helper.initialUsers[0]);

  const blogWithoutTitle = {
    author: 'Heikki Hiilamo',
    url: 'https://www.yle.fi',
  };
  const blogWithoutUrl = {
    title: 'Moon',
    author: 'Heikki Hiilamo',
  };
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${user.body.token}`)
    .send(blogWithoutTitle)
    .expect(400);

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${user.body.token}`)
    .send(blogWithoutUrl)
    .expect(400);
});

test('blog can be deleted', async () => {
  const user = await api
    .post('/api/login')
    .send(helper.initialUsers[0]);

  const blogsAtEnd = await helper.blogsInDb();
  const oneBlogId = blogsAtEnd[0].id;
  await api

    .delete(`/api/blogs/${oneBlogId}`)
    .set('Authorization', `Bearer ${user.body.token}`)
    .expect(204);
});

test('blog can be modified', async () => {
  const user = await api
    .post('/api/login')
    .send(helper.initialUsers[0]);

  const blogsAtEnd = await helper.blogsInDb();
  const oneBlogId = blogsAtEnd[0].id;
  const existingLikes = blogsAtEnd[0].likes;

  const differentLikes = await api

    .put(`/api/blogs/${oneBlogId}`)
    .set('Authorization', `Bearer ${user.body.token}`)
    .send({ likes: existingLikes + 1 })
    .expect(200);

  const equalLikes = await api
    .put(`/api/blogs/${oneBlogId}`)
    .set('Authorization', `Bearer ${user.body.token}`)
    .send({ likes: existingLikes + 1 })
    .expect(200);

  expect(equalLikes.body.message).toBe(
    'Likes already set to the specified value.',
  );
});

afterAll(async () => {
  await mongoose.connection.close();
});

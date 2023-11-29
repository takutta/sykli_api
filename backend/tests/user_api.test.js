const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);

const User = require('../models/user');
const helper = require('./test_helper');

beforeEach(async () => {
  await User.deleteMany({});
  await helper.createInitialUsers();
});

test('users are returned as json', async () => {
  await api
    .get('/api/users')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('creation fails with proper statuscode and message if username already taken', async () => {
  const usersAtStart = await helper.usersInDb();

  const newUser = {
    username: 'mane',
    name: 'Mauno Ahtisaari',
    password: 'sillisalaatti',
  };

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/);

  expect(result.body.error).toContain(
    'expected `username` to be unique',
  );

  const usersAtEnd = await helper.usersInDb();
  expect(usersAtEnd).toHaveLength(usersAtStart.length);
});

test('all users are returned', async () => {
  const response = await api.get('/api/users');

  expect(response.body).toHaveLength(helper.initialUsers.length);
});

test('returned users identifier field is id', async () => {
  const response = await api.get('/api/users');
  const contents = response.body.map((r) => r.id);
  expect(contents).toBeDefined();
});

test('a valid user can be added ', async () => {
  const newUser = {
    username: 'pekka',
    name: 'Pekka Pekkanen',
    password: 'salainen',
  };

  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const usersAtEnd = await helper.usersInDb();
  expect(usersAtEnd).toHaveLength(helper.initialUsers.length + 1);

  const name = usersAtEnd.map((n) => n.name);
  expect(name).toContain('Pekka Pekkanen');
});

test('error 400 if username, name or password undefined', async () => {
  const userWithoutUsername = {
    name: 'Heikki Hiilamo',
    password: 'salainen',
  };
  const userWithoutName = {
    username: 'heka',
    password: 'salainen',
  };
  const userWithoutPassword = {
    username: 'heka',
    name: 'Heikki Hiilamo',
  };
  await api.post('/api/users').send(userWithoutUsername).expect(400);
}, 20000);

test('user can be deleted', async () => {
  const usersAtEnd = await helper.usersInDb();
  const oneUserId = usersAtEnd[0].id;
  await api.delete(`/api/users/${oneUserId}`).expect(204);
});

afterAll(async () => {
  await mongoose.connection.close();
});

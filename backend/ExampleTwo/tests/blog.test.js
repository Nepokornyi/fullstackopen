const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helper = require('./test.helper');
const Blog = require('../models/blog');

const api = supertest(app);

//* clear and insert initial data on each test run

beforeEach(async () => {
    await Blog.deleteMany({});

    const blogObject = helper.initialBlog
        .map(blog => new Blog(blog));
    const promisesArray = blogObject.map(blog => blog.save());
    await Promise.all(promisesArray);
})

//* ------

test('all blogs are returned', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/);
}, 10000)

test('data contains specific string', async () => {
    const response = await api.get('/api/blogs');

    const contents = response.body.map(r => r.title);
    expect(contents).toContain('Vadimback');
})

test('blog has id property', async () => {
    const response = await helper.blogsInDb()
    const blogToCheck = response[0];
    expect(blogToCheck.id).toBeDefined();
})

test('a valid blog can be added', async () => {
    const newBlog = {
        title: 'author',
        author: 'MeMyselfI',
        url: 'test.com',
        likes: 100
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

    const response = await helper.blogsInDb();
    expect(response).toHaveLength(helper.initialBlog.length + 1);
    const contents = response.map(r => r.author);
    expect(contents).toContain(
        'MeMyselfI'
    );
})

test('a specific blog can be viewed', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToView = blogsAtStart[0];

    const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);

    expect(resultBlog.body.title).toEqual(blogToView.title);
})

test('a blog can be deleted', async() => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(
        helper.initialBlog.length - 1
    )

    const content = blogsAtEnd.map(r => r.title)
    expect(content).not.toContain(blogToDelete.title)
}, 10000)

test('every blog has likes', async () => {
    const response = await helper.blogsInDb();
    const contents = response.map(blog => blog.likes);
    console.log(contents);
    contents.forEach( likes =>
        expect(likes).toBeDefined()
    )
})

test('blog without author & title is not added', async () => {
    const newBlog = {
        url: 'works.com',
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

    const response = await helper.blogsInDb()
    expect(response).toHaveLength(helper.initialBlog.length)
})

afterAll(async () => {
    await mongoose.connection.close();
})
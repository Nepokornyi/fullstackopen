const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const bcrypt = require('bcrypt');
const helper = require('./test.helper');
const Blog = require('../models/blog');
const User = require('../models/user');

const api = supertest(app);

//* clear and insert initial data on each test run

let token = '';
let userId;

beforeEach(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({ username: 'root', password: passwordHash })

    const savedUser = await user.save();
    userId = savedUser.id;

    const userLogin = {
        username: 'root',
        password: 'sekret'
    };

    const loggedInUser = await api
        .post('/api/login')
        .send(userLogin);

    token = loggedInUser.body.token;

    const blogObject = helper.initialBlog
        .map(blog => new Blog({ ...blog, user: userId }));
    const promisesArray = blogObject.map(blog => blog.save());
    await Promise.all(promisesArray);
})


//* ------

describe('when theres initially one user in db', () => {
    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: 'whatever',
            name: 'Def Whatever',
            password: 'test',
        }

        await api
            .post('/api/users')
            .set('Authorization', `Bearer ${token}`)
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

        const usernames = usersAtEnd.map(user => user.username)
        expect(usernames).toContain(newUser.username);
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen',
        }

        const result = await api
            .post('/api/users')
            .set('Authorization', `Bearer ${token}`)
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('Validation failed');

        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd).toEqual(usersAtStart);
    })
})

//* ------
describe('fetching data from db', () => {
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

    test('every blog has likes', async () => {
        const response = await helper.blogsInDb();
        const contents = response.map(blog => blog.likes);

        contents.forEach( likes =>
            expect(likes).toBeDefined()
        )
    })
})

describe('viewing a specific blog', () => {
    test('a specific blog can be viewed', async () => {
        const blogsAtStart = await helper.blogsInDb();
        const blogToView = blogsAtStart[0];

        const resultBlog = await api
            .get(`/api/blogs/${blogToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/);

        expect(resultBlog.body.title).toEqual(blogToView.title);
    })
})

describe('adding, removing and modifying blogs', () => {
    test('a valid blog can be added', async () => {
        const newBlog = {
            title: 'author',
            author: 'root',
            url: 'test.com',
            likes: 100,
            user: userId
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const response = await helper.blogsInDb();
        expect(response).toHaveLength(helper.initialBlog.length + 1);
        const contents = response.map(r => r.author);
        expect(contents).toContain(
            'root'
        );
    })

    test('a blog can be deleted', async() => {
        const blogsAtStart = await helper.blogsInDb();
        console.log(blogsAtStart)
        const blogToDelete = blogsAtStart[0];

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb();
        expect(blogsAtEnd).toHaveLength(
            helper.initialBlog.length - 1
        )

        const content = blogsAtEnd.map(r => r.title)
        expect(content).not.toContain(blogToDelete.title)
    }, 10000)

    test('blog without author & title is not added', async () => {
        const newBlog = {
            url: 'works.com',
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(400)

        const response = await helper.blogsInDb()
        expect(response).toHaveLength(helper.initialBlog.length)
    })

    test('update likes for specific blog', async () => {
        const blogs = await helper.blogsInDb();
        const specificBlog = blogs[0];
        const updatedBlog = {
            likes: 100
        }

        await api
            .put(`/api/blogs/${specificBlog.id}`)
            .send(updatedBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/);

        const updatedBlogs = await helper.blogsInDb();
        const contents = updatedBlogs.map(content => content.likes);
        expect(contents).toContain(100)
    }, 10000)
})

afterAll(async () => {
    await mongoose.connection.close();
})
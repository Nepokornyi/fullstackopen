const Blog = require('../models/blog');
const User = require('../models/user');

const initialBlog = [
    {
        title: 'Vadimback',
        author: 'John Text',
        url: 'loveu.com',
        likes: 123
    },
    {
        title: 'John Sho',
        author: 'Text for Sex',
        url: 'url.com',
        likes: 321
    },
    {
        title: 'Def Test',
        author: 'Text for Test',
        url: 'pirates.rom'
    },
]

const nonExistingId = async () => {
    const newBlog = new Blog({ title: 'willRemoveThisSoon' });
    await newBlog.save();
    await newBlog.deleteOne();

    return newBlog._id.toString();
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({});
    return users.map(user => user.toJSON());
}

module.exports = { initialBlog, nonExistingId, blogsInDb, usersInDb }
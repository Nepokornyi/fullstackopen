const BlogRouter = require('express').Router();
const Blog = require('../models/blog');
const middleware = require('../utils/middleware');


BlogRouter.get('/', async (request, response) => {
    try{
        const blogs = await Blog.find({})
            .populate('user', { username: 1, name: 1 });
        if(blogs){
            response.json(blogs);
        }
        else{
            response.status(400).end();
        }
    }
    catch(exception){
        console.log(exception)
    }
})

BlogRouter.get('/:id', async (request, response) => {
    try{
        const blog = await Blog.findById(request.params.id)
        if(blog){
            response.json(blog)
        }
        else{
            response.status(400).end();
        }
    }
    catch(exception){
        console.log(exception);
    }
})

BlogRouter.post('/', middleware.userExtractor , async (request, response) => {
    const blog = new Blog(request.body);
    const user = request.user;

    try{

        if(!user){
            return response.status(401).json({ error: 'token missing or invalid' });
        }

        blog.user = user.id;

        const result = await blog.save();
        user.blogs = user.blogs.concat(result._id)
        await user.save();

        if(result){
            response.status(201).json(result);
        }
    }
    catch(exception){
        if(exception.name === 'ValidationError'){
            return response.status(400).json({ error: 'Validation failed' })
        }
        else if (exception.name ===  'JsonWebTokenError'){
            return response.status(401).json({ error: exception.message })
        }
        else if (exception.name === 'TokenExpiredError'){
            return response.status(401).json({ error: 'token expired' })
        }
        console.log(exception);
    }
})

BlogRouter.put('/:id', async (request, response) => {
    const { id } = request.params;
    const { likes } = request.body;

    try{
        const updatedBlog = await Blog.findOneAndUpdate({ _id: id } ,{ likes }, { new: true, runValidators: true, context: 'query' })
        response.json(updatedBlog)
    }
    catch(exception){
        console.log(exception);
    }
})

BlogRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
    const userId = request.user;
    try{
        const blog = await Blog.findById(request.params.id);

        if (!blog) {
            return response.status(404).json({ error: 'blog not found' });
        }

        if(blog.user.toString() === userId._id.toString()){
            await Blog.findByIdAndDelete(request.params.id.toString())
            console.log('deleted', blog)
            response.status(204).end();
        }
        else{
            response.status(401).json({ error: 'unauthorized' })
        }

    }
    catch(exception){
        console.log(exception)
    }
})

module.exports = BlogRouter;
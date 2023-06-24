const BlogRouter = require('express').Router();
const Blog = require('../models/blog')


BlogRouter.get('/', async (request, response) => {
    try{
        const blogs = await Blog.find({});
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

BlogRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)

    try{
        const result = await blog.save();
        if(result){
            response.status(201).json(result);
        }
    }
    catch(exception){
        if(exception.name === 'ValidationError'){
            return response.status(400).json({ error: 'Validation failed' })
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


BlogRouter.delete('/:id', async (request, response) => {
    try{
        const blog = await Blog.findByIdAndDelete(request.params.id.toString())
        console.log('deleted', blog)
        response.status(204).end();
    }
    catch(exception){
        console.log(exception)
    }
})

module.exports = BlogRouter;
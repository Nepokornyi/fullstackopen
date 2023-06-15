const usersRouter = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
        .populate('blogs', { title: 1, author: 1, url: 1, likes: 1 })
    response.json(users);
})


usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body;
    const saltRounds = 10;

    try{
        if(password.length < 3){
            return response.status(400).json({ error: 'Password must be at least 3 characters long' })
        }
        const hashPassword = await bcrypt.hash(password, saltRounds);
        const user = new User({
            username,
            name,
            password: hashPassword
        })

        const savedUser = await user.save();
        if(savedUser){
            response.status(201).json(savedUser);
        }
    }
    catch(exception){
        if(exception.name === 'ValidationError'){
            return response.status(400).json({ error: 'Validation failed' })
        }

        console.log(exception);
    }

})


module.exports = usersRouter;


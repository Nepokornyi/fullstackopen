require('dotenv').config()

const PORT = process.env.PORT2;

const MONGODB_URI = process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGO_DB
    : process.env.MONGO_DB2;


module.exports = { PORT, MONGODB_URI }
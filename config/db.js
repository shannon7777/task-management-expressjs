// Configuring mongo db connection and export it to index.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const connectDb = async () => {
    dotenv.config();
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Mongo DB connected:  ${conn.connection.host}`)
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = connectDb;
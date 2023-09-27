const mongoose = require('mongoose');
const { getAiUser } = require("../controllers/aiController")

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`.blue.bold);
        const aiUser = await getAiUser()
        console.log("Ai user : ", aiUser)
    } catch (error) {
        console.log(`${error.message}`.red.bold);
        process.exit();
    }
};

module.exports = connectDB;
const express = require("express");
const dotenv = require("dotenv");
const { chats } = require("./data/data");
const connectDB = require("./Config/db");
const colors = require('colors');
const userRoutes = require('./Routes/userRoutes')
const chatRoutes = require('./Routes/chatRoutes')
const videoChatRoutes = require('./Routes/videoChatRoutes')
const messageRoutes = require('./Routes/messageRoutes')
const { notFound, errorHandler } = require('./middleware/errorMiddleware')



dotenv.config();
const app = express();
connectDB();

app.use(express.json());

app.get('/', (req, res) => {
    res.send("API is running");
})


app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRoutes)
app.use('/api/videoChat', videoChatRoutes)

app.use(notFound);
app.use(errorHandler);


const PORT = process.env.PORT || 5000;
const server = app.listen(5000, console.log(`server started on PORT ${PORT}`.yellow.bold))

const io = require('socket.io')(server, {

    PingTimeout: 60000,
    cors: {
        origin: ["http://localhost:3000", "https://chat-app-frontend-neon.vercel.app", "https://chat-app-frontend-git-master-deveshs-projects.vercel.app"]
    }
});

io.on("connection", (socket) => {

    socket.on('setup', (userData) => {
        socket.join(userData._id);
        socket.emit('connected');
    })

    socket.on('join chat', (room) => {
        socket.join(room);
    })

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on('new message', (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;
        if (!chat.users) return console.log("users not defined");

        chat.users.forEach(user => {
            if (user._id == newMessageRecieved.sender._id) return;

            socket.in(user._id).emit("message recieved", newMessageRecieved)
        });
    });

    socket.off("setup", () => {
        console.log("user disconnected");
        socket.leave(userData._id);
    });
})
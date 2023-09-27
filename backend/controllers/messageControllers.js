const asyncHandler = require('express-async-handler')
const Message = require('../models/messageModel')
const generateToken = require('../Config/generateToken');
const User = require('../models/userModel');
const Chat = require('../models/chatModel');
const { aiReplier, getAiUser } = require('./aiController');
// const { log } = require('async');

const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId, link, toAi } = req.body;

    console.log("in sendMessage")

    console.log(content)

    // if ((!content && !link) || !chatId) {

    //     return res.status(400);
    // }

    var newMessage = {
        sender: req.user._id,
        content: content,
        link: link,
        chat: chatId
    }

    try {

        var message = await Message.create(newMessage);
        message = await message.populate('sender', "name pic");
        message = await message.populate('chat');
        message = await User.populate(message, {
            path: "chat.users",
            select: 'name pic email'

        });

        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message
        })

        if (toAi) {
            const aiUser = await getAiUser()
            var reply
            try {
                reply = await aiReplier(content)

            }
            catch {
                reply = "Bot currently not working"
            }
            console.log(reply)
            const newAiMessage = {
                sender: aiUser._id,
                content: reply,
                chat: chatId
            }
            var aiMessage = await Message.create(newAiMessage);
            aiMessage = await aiMessage.populate('sender', "name pic");
            aiMessage = await aiMessage.populate('chat');
            aiMessage = await User.populate(aiMessage, {
                path: "chat.users",
                select: 'name pic email'

            });
            await Chat.findByIdAndUpdate(aiUser._id, {
                latestMessage: aiMessage
            })

            return res.json({
                userMessage: message, aiMessage
            })
        }
        console.log(message)

        res.json({ userMessage: message });

    } catch (error) {
        res.status(400);
        console.log(error)
        throw new Error(error.message);
    }
})


const allMessages = asyncHandler(async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId }).populate('sender', 'name pic email')
            .populate('chat');

        res.json(messages);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
})

module.exports = { sendMessage, allMessages };
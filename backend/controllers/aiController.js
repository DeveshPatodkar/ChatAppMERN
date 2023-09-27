// import OpenAI from 'openai';
const OpenAI = require('openai');
const User = require('../models/userModel');



const aiEmail = "ai@devesh.com"

const getAiUser = async () => {
    const aiUser = await User.findOne({ email: aiEmail });
    if (aiUser) {
        return aiUser
    }
    const newAiUserObj = {
        name: "AI Bot", email: aiEmail, password: "AIPassword"
    }

    const newAiUser = await User.create(newAiUserObj)
    return newAiUser
}

const aiReplier = async (content) => {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });
    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: "user", content: content }],
        model: "gpt-3.5-turbo",
    });
    console.log(chatCompletion);
    return chatCompletion["choices"][0]["message"]["content"];
};



// export const aiController = async (req, res) => {
//     const reply = await aiReplier(req.body.content);

// }

module.exports = {
    aiReplier,
    getAiUser
}

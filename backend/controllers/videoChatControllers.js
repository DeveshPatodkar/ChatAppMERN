const axios = require("axios");
const { teamId, devId } = require("../Config/videoChat");

const service_base_url = "https://api.digitalsamba.com/api/v1/rooms"

const createMeeting = async (req, res) => {
    const body = {
        privacy: "public"
    }
    const config = {
        headers: {
            "Content-type": "application/json",
        },
        auth: {
            username: "c0fe6b8c-1012-401a-9256-c40bc24509e9",
            password: "8xlxErSPlCg44ozNsYZ0GQFTWTKSTiVaEMiaFQiQ7AhBjwXKkFlhSQ4Xtq2ROuqH",
        },
    };
    try {
        const response = await axios.post(service_base_url, body, config);
        // console.log(response.data);
        res.status(200).send({data : response.data})
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err);
    }

}
// PSj0oam7jSiqvUQ

module.exports = { createMeeting };
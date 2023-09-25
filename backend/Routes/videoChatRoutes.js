const express = require("express")
const { createMeeting } = require("../controllers/videoChatControllers")
const { teamId, devId } = require("../Config/videoChat")

const router = express.Router()

router.route('/').post(createMeeting);

module.exports = router;

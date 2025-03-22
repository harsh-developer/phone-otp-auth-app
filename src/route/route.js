const express = require('express')
const router = express.Router()
const { registerUser, userLogin, getUserList } = require('../controller/userController');
const { sendOtp, userVerify } = require('../controller/twilioOtpController');
const { authentication } = require("../middleware/auth")


//<<-----------------------------------------user Model API-------------------------------------------------->>
router.post('/register', registerUser);
router.post("/login", userLogin);
router.post("/getUserList", authentication, getUserList);
router.post("/sendOtp", authentication, sendOtp);
router.post("/verifyOtp", authentication, userVerify);


// ==========> This API is used for handling any invalid Endpoints <=========== 
router.all("/*", async function (req, res) {
  res.status(404).send({ status: false, msg: "Page Not Found!!!" });
});


module.exports = router
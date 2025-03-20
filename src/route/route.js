const express = require('express')
const router = express.Router()
const { registerUser, userLogin, getUserList, userVerify } = require('../controller/userController')
const { authentication } = require("../middleware/auth")


//<<-----------------------------------------user Model API-------------------------------------------------->>
router.post('/register', registerUser);
router.post("/login", userLogin);
router.post("/verifyUser", authentication, userVerify)
router.post("/getUserList", authentication, getUserList);


// ==========> This API is used for handling any invalid Endpoints <=========== 
router.all("/*", async function (req, res) {
  res.status(404).send({ status: false, msg: "Page Not Found!!!" });
});


module.exports = router
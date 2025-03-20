const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require('dotenv');
const { isValid, isValidMail, isValidMobile, isValidRequest, isValidPassword } = require("../validator/validation");

dotenv.config();



//==============================================register user==============================================//

const registerUser = async function (req, res) {
    try {
        let userDetails = req.body.data;
        let { email, password, phone } = userDetails;


        if (!isValidRequest(userDetails)) {
            return res.status(400).send({ status: false, msg: "Please enter details for user registration." })
        }

        if (!isValid(email)) {
            return res.status(400).send({ status: false, msg: "Please enter email for registration." })
        }

        if (!isValidMail(email)) {
            return res.status(400).send({ status: false, msg: "Please enter a valid email address." })
        }

        let mailCheck = await userModel.findOne({ email });

        if (mailCheck) {
            return res.status(400).send({ status: false, msg: `${email} already registered, try new.` })
        }

        if (!phone) {
            return res.status(400).send({ status: false, msg: "Please enter phone number for registration" })
        }
        if (!isValidMobile(phone)) {
            return res.status(400).send({ status: false, msg: "Please enter a valid Indian number." })
        }

        let phoneCheck = await userModel.findOne({ phone })
        if (phoneCheck) {
            return res.status(400).send({ status: false, msg: `${phone} already registered, try new.` })
        }

        if (!password) {
            return res.status(400).send({ status: false, msg: "Please enter a strong password for registration." })
        }
        if (!isValidPassword(password)) {
            return res.status(400).send({ status: false, msg: "Please enter a password which contains min 8 and maximum 15 letters." })
        }
        if (password) {
            const salt = await bcrypt.genSalt(10)
            const newPassword = await bcrypt.hash(password, salt)
            password = newPassword
        }

        let responseBody = { email, phone, password };

        let createUser = await userModel.create(responseBody);

        return res.status(201).send({ status: true, message: "User created successfully.", data: createUser })
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
};


// user phone number verification
const userVerify = async function (req, res) {
    try {
        let userDetails = req.body.data;
        let { phone } = userDetails;

        if (!phone) {
            return res.status(400).send({ status: false, msg: "Please enter phone number for registration" })
        }

        if (!isValidMobile(phone)) {
            return res.status(400).send({ status: false, msg: "Please enter a valid Indian number." })
        }

        let phoneCheck = await userModel.findOne({ phone })
        if (!phoneCheck) {
            return res.status(400).send({ status: false, msg: `${phone} is not registered with us.` })
        }

        let obj = { isVerifiedPhone: true };

        let updateProfileDetails = await userModel.findOneAndUpdate({ phone: phone }, { $set: obj }, { new: true });

        return res.status(201).send({ status: true, message: "Phone Verified successfully", data: updateProfileDetails });
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}


//================================================userlogin================================================//

const userLogin = async function (req, res) {
    try {
        let data = req.body.data;

        if (!isValidRequest(data)) {
            return res.status(400).send({ status: false, message: "Invalid Request" })
        }

        let { email, password } = data;

        if (!isValid(email)) {
            return res.status(400).send({ status: false, message: "email is required" })
        }

        if (!isValid(password)) {
            return res.status(400).send({ status: false, message: "password is required" })
        }

        if (!isValidMail(email)) {
            return res.status(400).send({ status: false, message: "Please enter a valid email" })
        }

        if (!isValidPassword(password)) {
            return res.status(400).send({ status: false, msg: "Please enter a password which contains min 8 and maximum 15 " })
        }

        const loginUser = await userModel.findOne({ email: email });

        if (!loginUser) {
            return res.status(401).send({ status: false, message: "Not register email-id" });
        }

        let hashedpass = loginUser.password;

        const validpass = await bcrypt.compare(password, hashedpass);

        if (!validpass) {
            return res.status(401).send({ status: false, message: "Incorrect Password" })
        }

        let token = jwt.sign(
            {
                userId: loginUser._id,
                iat: Math.floor(Date.now() / 1000),
            }, process.env.JWT_SECRET, { expiresIn: '48h' } // token expiration of 2 days
        );

        res.setHeader("x-api-key", token);
        let dataToBeSend = { usedId: loginUser._id, token: { token } };
        res.status(200).send({ status: true, message: 'User login successfull', data: dataToBeSend });

    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


//=================================================getUser=================================================//

const getUserList = async function (req, res) {
    try {

        let userList = await userModel.find();

        if (!userList || userList.length <= 0) {
            return res.status(404).send({ status: false, message: "No User Found" });
        }
        //-------------------------------------checking Authorizaton------------------------->>

        res.status(200).send({ status: true, message: "User fetched successfully", data: userList })

    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
};


module.exports = { registerUser, userLogin, getUserList, userVerify }
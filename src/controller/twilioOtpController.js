const dotenv = require('dotenv');

dotenv.config();

const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const userModel = require("../models/userModel");


// defining a variable globally so i can compare it in another function which will be used for verifying the otp
let OTP;
let otpStore = {}; // this will be used for 
const sendOtp = async function (req, res) {
    try {

        let { phone } = req.body.data;

        if (!phone) {
            return res.status(400).send({ response: { error: true, msg: "Please enter phone number" } });
        }

        // generating OTP
        let digits = "0123456789";
        OTP = "";
        for (let i = 0; i < 6; i++) {
            OTP += digits[Math.floor(Math.random() * 10)];
        }

        otpStore[phone] = { OTP, expiresAt: Date.now() + 2 * 60 * 1000 };

        // making connection with the client
        const message = await client.messages
            .create({
                body: `Your OTP for verifying your phone number ${phone} is ${OTP}`,
                to: `${phone}`,
                from: process.env.TWILIO_SENDER_NUMBER,
                messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_ID
            });

        if (message) {
            res.status(200).send({ response: { error: false, msg: "OTP has been sent successfully" } });
        }
    }
    catch (err) {
        res.status(500).send({ response: { error: true, msg: err.message } });
    }
}



const userVerify = async function (req, res) {
    try {
        let userDetails = req.body.data;
        let { otp, phone } = userDetails;

        if (!otp) {
            return res.status(400).send({ response: { error: true, msg: "Please enter otp" } });
        }

        if (!phone) {
            return res.status(400).send({ response: { error: true, msg: "Please enter phone number" } });
        }

        let storedOtp = otpStore[phone];

        if (Date.now() > storedOtp.expiresAt) {
            delete otpStore[phone]; // remove expired OTP
            return res.status(400).send({ response: { error: true, msg: "OTP has expired", flag: 'EXPIRE' } });
        }

        if (storedOtp.OTP !== otp || otp.length != 6) {
            return res.status(400).send({ response: { error: true, msg: "Invalid OTP" } });
        }

        let phoneCheck = await userModel.findOne({ phone });

        if (!phoneCheck) {
            return res.status(400).send({ response: { error: true, msg: `${phone} is not registered with us.` } })
        }

        let obj = { isVerifiedPhone: true };

        let updateProfileDetails = await userModel.findOneAndUpdate({ phone: phone }, { $set: obj }, { new: true });

        delete otpStore[phone]; // Remove OTP after successful verification

        return res.status(201).send({ response: { error: false, msg: "Phone Verified successfully", data: updateProfileDetails } });
    }
    catch (err) {
        return res.status(500).send({ response: { error: true, msg: err.message } });
    }
}


module.exports = { sendOtp, userVerify };

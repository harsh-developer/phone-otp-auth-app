const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');

dotenv.config();

const authentication = async function (req, res, next) {
    try {
        let bearerToken = req.headers.authorization;

        if (!bearerToken)
            return res.status(401).send({ status: false, message: "API token is missing." });

        bearerToken = bearerToken.split(" ");

        let token = bearerToken[1];

        jwt.verify(token, process.env.JWT_SECRET, function (err, decodedtoken) {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    return res.status(401).send({ status: false, message: "Token has expired. Please log in again." });
                }
                return res.status(400).send({ status: false, message: err.message })
            }
            else {
                idFromToken = decodedtoken.userId;
                next();
            }
        });
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
};

module.exports = { authentication }
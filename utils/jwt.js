const jwt = require('jsonwebtoken');

const createJWT = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "24h" });
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development', // Use secure in both production and development for testing
        sameSite: 'None',
        maxAge: 60 * 60 * 24 * 1000 // 1 day in milliseconds
    });
}

module.exports = createJWT;

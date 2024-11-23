const jwt = require('jsonwebtoken');

const createJWT = (res, userId) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in the environment variables.");
    }

    try {
        const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "24h" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production' || window.location.protocol === 'https:', // Ensures secure in production and localhost over HTTPS
            sameSite: 'None',
            maxAge: 60 * 60 * 24 * 1000, // 1 day
        });
   

    } catch (error) {
        console.error("Error creating JWT:", error);
        throw new Error("Failed to create JWT");
    }
};

module.exports = createJWT;

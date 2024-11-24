const jwt = require('jsonwebtoken');

const createJWT = (res, userId) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in the environment variables.");
    }

    try {
        const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "30d" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None',
            maxAge: 30 * 24 * 60 * 60 * 1000
        });
   

    } catch (error) {
        console.error("Error creating JWT:", error);
        throw new Error("Failed to create JWT");
    }
};

module.exports = createJWT;

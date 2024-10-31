

const jwt = require('jsonwebtoken')


const createJWT=(res,userId) =>{
    const token = jwt.sign({userId},process.env.JWT_SECRET,{expiresIn : "1d"})
    res.cookie("token",token,{
        httpOnly : true,
        secure : process.env.NODE_ENV !== 'development',
        sameSite : "strict",
        maxAge : 1 * 24 * 60 * 1000
    })
}
module.exports = createJWT
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')


const protectRoute = async (req, res, next) => {
    try {
      let token = req.cookies?.token;
  
      if (!token) {
        return res.status(401).json({ status: false, message: "No token provided." });
      }
  
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const resp = await User.findById(decodedToken.userId).select("isAdmin email");
  
      req.user = {
        email: resp.email,
        isAdmin: resp.isAdmin,
        userId: decodedToken.userId,
      };
  
      next();
    } catch (error) {
      console.log(error);
      return res.status(401).json({ status: false, message: "Not authorized. Try login again." });
    }
  };
  

  const isAdminRoute = (req, res, next) => {
    try {
      if (req.user && req.user.isAdmin) {
        next();
      } else {
        return res.status(403).json({ status: false, message: "Not authorized as Admin." });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: false, message: "Server error." });
    }
  };
  

module.exports ={
    protectRoute,
    isAdminRoute
}
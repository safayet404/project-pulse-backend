

const { default: mongoose } = require("mongoose");
const dotenv = require("dotenv").config();

const dbConnection = async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI)

        console.log("DB Connected");
        

    }catch(error)
    {
        console.log("DB Connect" + error)
    }
}

module.exports = dbConnection;
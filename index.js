
const cookieParser = require("cookie-parser");
const cors = require('cors')
const dotenv = require('dotenv')
const morgan = require('morgan')
const express = require('express')
const dbConnection = require('./utils/connectDB')
const {routeNotFound, errorHandler} = require("./middlewares/errorMiddleware")
dotenv.config()

dbConnection()
const allRouter = require('./routes/allRouter')
const PORT = process.env.PORT || 5000
const app = express()
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(cors())

const corsConfig = {
    origin : "*",
    credential : true,
    methods : ["GET","POST","PUT","DELETE"]
}
app.use(cors(corsConfig))
app.use("/api",allRouter)


app.use(morgan("dev"))

app.use(routeNotFound)
app.use(errorHandler)

app.listen(PORT,() => console.log(`Server is running at ${PORT}`))
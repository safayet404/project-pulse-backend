
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

const allowedOrigins = [
  "https://project-management-system-cloud.vercel.app"
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the request if origin is in the list
    } else {
      callback(new Error("Not allowed by CORS")); // Reject the request
    }
  },
  credentials: true, // Allow credentials (cookies, authorization headers)
  methods: "GET,POST,PUT,DELETE,PATCH,OPTIONS", // Allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"] // Allowed headers
};

// Apply CORS middleware
app.use(cors(corsOptions));
app.use("/api",allRouter)


app.use(morgan("dev"))

app.use(routeNotFound)
app.use(errorHandler)

app.listen(PORT,() => console.log(`Server is running at ${PORT}`))
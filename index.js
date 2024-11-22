
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
  "http://localhost:3000",  // Local development frontend
  "https://your-frontend-domain.com",  // Deployed frontend URL
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Allow cookies and credentials
  })
);
app.use("/api",allRouter)


app.use(morgan("dev"))

app.use(routeNotFound)
app.use(errorHandler)

app.listen(PORT,() => console.log(`Server is running at ${PORT}`))
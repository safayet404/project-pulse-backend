const express = require('express')
const userRoutes = require('./userRoutes')
const taskRoutes = require('./taskRoutes')

const router = express.Router()

router.use("/user",userRoutes)
router.use("/task",taskRoutes)



module.exports = router
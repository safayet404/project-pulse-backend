const express = require('express')
const { protectRoute, isAdminRoute } = require('../middlewares/authMiddleware')
const { registerUser, loginUser, logoutUser, getTeamList, getNotificationsList, updateUserProfile, markNotificationRead, changeUserPassword, activateUserProfile, deleteUserProfile } = require('../controllers/userController')

const router = express.Router()

router.post("/register",registerUser)
router.post("/login",loginUser)
router.post("/logout",logoutUser)



router.get("/get-team",protectRoute,isAdminRoute,getTeamList)
router.get("/notification",protectRoute,getNotificationsList)

router.put("/profile",protectRoute,updateUserProfile)
router.put("/read-noti",protectRoute,markNotificationRead)
router.put("/change-password",protectRoute,changeUserPassword)

router.route("/:id").put(protectRoute,isAdminRoute,activateUserProfile).delete(protectRoute,isAdminRoute,deleteUserProfile)


module.exports = router
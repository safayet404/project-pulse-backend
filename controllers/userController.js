const User = require("../models/userModel")
const createJWT = require("../utils/jwt")
const Notice= require('../models/notificationModel')
const { default: mongoose } = require("mongoose")
const registerUser = async(req,res) =>{
    try{
        const {name,email,password,isAdmin,role,title} = req.body

        const userExist = await User.findOne({email})

        if(userExist)
        {
            return res.status(400).json({status : false,message : "User already exist"})
        }
        const user = await User.create({
            name,email,password,isAdmin,role,title
        })

        if(user)
        {
            isAdmin ? createJWT(res,user._id) : null

            user.password = undefined
            res.status(201).json(user)
        }
        else
        {
            return res.status(400).json({status : false,message : "Invalid user data"})
        }

    }catch(error)
    {
        throw new Error(error)
    }
}


const loginUser = async(req,res) =>{
    try{

        const {email,password} = req.body
        const user = await User.findOne({email})
        if(!user)
        {
            return res.status(401).json({status : false,message : "Invalid email or password"})
        }

        if(!user?.isActive)
        {
            return res.status(401).json({status:false,message : "User account has been deactivated ,contact the administrator"})
        }

        const isMatch = await user.isPasswordMatched(password)
        if(user && isMatch)
        {
            createJWT(res,user._id)
            user.password = undefined
            res.status(200).json(user)
        }
        else
        {
            return res.status(401).json({status : false,message : "Invalid email or password"})
        }



    }catch(error)
    {
        throw new Error(error)
    }
}

const logoutUser = async(req,res) =>{
    try{
        res.cookie("token","",{
            httpOnly : true,
            expires : new Date(0) 
        })

        res.status(200).json({message : "Logout Successfully"})
    }catch(error)
    {
        return res.status(400).json({status : false, message: error.message})
    }
}
const getTeamList = async(req,res) =>{
    try{
        const users = await User.find().select("name title role email isActive")
        res.status(200).json(users)

    }catch(error)
    {
        return res.status(400).json({status : false, message: error.message})
    }
}
const getNotificationsList = async(req,res) =>{
    try{
        const {userId} = req.user

        const notice = await Notice.find({
            team : userId,
            isRead : {$nin : userId},
        }).populate("task","title")

        res.status(201).json(notice)
    }catch(error)
    {
        return res.status(400).json({status : false, message: error.message})
    }
}
const updateUserProfile = async(req,res) =>{
    try{
        
        const {userId,isAdmin} = req.user 
        const {_id} = req.body
        const id = isAdmin && userId === _id ? userId : isAdmin && userId !== _id ? _id : userId

        const user = await User.findById(id)
        if(user)
        {
            user.name = req.body.name || user.name
            user.title = req.body.title || user.title
            user.role = req.body.role || user.role

            const updateUser = await user.save()
            user.password = undefined

            res.status(201).json({status : true, message : "Profile Updated Successfully",user : updateUser})
        }
        else
        {
            return res.status(404).json({status : false, message:"User not found"})

        }

    }catch(error)
    {
        return res.status(400).json({status : false, message: error.message})
    }
}
const markNotificationRead = async(req,res) =>{
    try{
        const {userId} = req.user
        const {isReadType,id} = req.query

        if(isReadType === "all")
        {
            await Notice.updateMany({team : userId , isRead : {$nin : [userId]}} ,{$push : {isRead : userId}},{new :true})
        }
        else
        {
            await Notice.findOneAndUpdate({ _id : id, isRead : {$nin:[userId]}},{$push : {isRead : userId}},{new : true})
        }
        res.status(201).json({status:true, message : "Done"})
    }catch(error)
    {
        return res.status(400).json({status : false, message: error.message})
    }
}


const changeUserPassword = async(req,res) =>{
    try{
        const {userId} = req.user
        const user = await User.findById(userId)

        if(user)
        {
            user.password = req.body.password
            await user.save()

            user.password = undefined

            res.status(201).json({status : true, message: "Password changed successfully"})
        }
        else
        {
            res.status(404).json({status : false,message : "User not found"})
        }
    }catch(error)
    {
        throw new Error(error)
    }
}

const activateUserProfile = async(req,res) =>{
    try{
        const {id} = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ status: false, message: "Invalid user ID" });
          }
        const user = await User.findById(id)

        if(user)
        {
            user.isActive = req.body.isActive
            await user.save()

            user.password = undefined

            res.status(201).json({status : true, message: `User account has been ${user?.isActive ? "activated" : "disabled"}` })
        }
        else
        {
            res.status(404).json({status : false,message : "User not found"})
        }
    }catch(error)
    {
        throw new Error(error)
    }
}
const deleteUserProfile = async(req,res) =>{
    try{
        const {id} = req.params
        await User.findByIdAndDelete(id)

        res.status(200).json({status : true, message: "User deleted successfully"})
        
       
    }catch(error)
    {
        throw new Error(error)
    }
}


module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getTeamList,
    getNotificationsList,
    updateUserProfile,
    markNotificationRead,
    changeUserPassword,
    activateUserProfile,
    deleteUserProfile
}
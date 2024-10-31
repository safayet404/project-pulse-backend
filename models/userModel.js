const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

var userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    title: {
        type : String,
        required : true
    },
    role:{
        type:String,
        required : true
    } ,
    email:{
        type:String,
        required:true,
        unique:true,
    },
    isAdmin:{
        type:Boolean,
        require:true,
        default:false
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId , 
        ref : "Task"
    }],
    isActive:{
        type:Boolean,
        required:true,
        default:true,
    },
    password:{
        type:String,
        required:true,
    },
},{timestamps:true});


userSchema.pre("save",async function (next){
    if(!this.isModified("password"))
    {
        next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt)
})

userSchema.methods.isPasswordMatched = async function(enterdPassword){
    return await bcrypt.compare(enterdPassword,this.password)
}

module.exports = mongoose.model('User', userSchema);
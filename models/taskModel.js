
const mongoose = require('mongoose');
var taskSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        
    },
    date:{
        type:Date,
        default:new Date(),
    },
    priority:{
        type:String,
        default : "normal", enum :["high","medium","normal","low"]
    },
    stage:{
        type:String,
        default : "todo", enum :["todo","in progress","completed",]
    },
    activities:{
        type : {

            type:String,
            default : "assigned", enum :["assigned","started","in progress","bug","completed","commented"]
        },
        activity : String,
        date : {type:Date,default : new Date()},
        by : {type:mongoose.Schema.ObjectId, ref: "User"},
 
        
        
    },
    subTasks : [
        {
            title : String,
            date:Date,
            tag:String
        }
    ],
    assets : [String],
    team : [{type : mongoose.Schema.ObjectId, ref :"User"}],
    isTrashed : {type : Boolean,default:false }
},{timestamps : true});

module.exports = mongoose.model('Task', taskSchema);


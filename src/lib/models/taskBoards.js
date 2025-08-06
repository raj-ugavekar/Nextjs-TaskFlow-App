import mongoose from "mongoose";

const TaskBoardSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    ownerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

mongoose.models = {};

export const TaskBoard = mongoose.model("TaskBoard",TaskBoardSchema);
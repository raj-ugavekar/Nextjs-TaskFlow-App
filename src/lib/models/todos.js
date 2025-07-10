import mongoose from "mongoose";

const todosSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    deadlineAt:{
        type:Date,
        required:true,
    },
    isCompleted:{
        type:Boolean,
        default:false
    },
    userId:{
        type : mongoose.Schema.Types.ObjectId,
        required:true,
        ref: "User",

    },
    createdAt:{
        type:Date,
        default: Date.now,
    }
});

mongoose.models = {};

export const Todos = mongoose.model("Todos",todosSchema);
import mongoose from "mongoose";

const ColumnsSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    boardId:{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "TaskBoard", 
        required: true 
    },
    order:{ 
        type: Number, 
        default: 0 
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    createdAt:{ 
        type: Date, 
        default: Date.now 
    }
})

mongoose.models = {};

export const Columns = mongoose.model("Columns",ColumnsSchema);
import { checkAuth, connectDB } from "@/lib/features/serverFeatures";
import { Columns } from "@/lib/models/columns";
import { TaskBoard } from "@/lib/models/taskBoards";
import { Tasks } from "@/lib/models/tasks";
import { NextResponse } from "next/server";

export async function GET(request,{params}){
    try {

        const {id} = await params;

        await connectDB();

        const user = await checkAuth();

        if(!user) return NextResponse.json({ message: "Login First" , success: false , status: 401 });

        const taskBoard = await TaskBoard.findOne({_id:id , ownerId: user._id});

        const columns = await Columns.find({boardId:taskBoard._id}).sort({order:1});

        const tasks = await Tasks.find({boardId:taskBoard._id}).sort({order:-1,deadlineAt:1});

        if(!taskBoard || !columns) return NextResponse.json({ message: "TaskBoard not found" , success: false , status: 404 });

        return NextResponse.json({ taskBoard: taskBoard , boardColumns : columns , tasks:tasks, success: true , status: 200  });
    } catch (error) {
        return NextResponse.json({ message: error.message , success: false , status: 500});
    }
}

export async function PUT(request,{params}){
    try {

        const {boardName} = await request.json();
        const {id} = await params;

        if (!boardName) return NextResponse.json({ message: "Please fill all fields",success: false,status: 400});

        await connectDB();

        const user = await checkAuth();

        if(!user) return NextResponse.json({ message: "Login First" , success: false , status: 401 });

        const updated = await TaskBoard.findOneAndUpdate({ _id: id, ownerId: user._id },{ name:boardName },{ new: true });

        if (!updated) return NextResponse.json({message: "Taskboard not found",success: false,status: 404});

        return NextResponse.json({ message: `Taskboard "${updated.name}" updated successfully` , success: true , status: 200  });
    } catch (error) {
         return NextResponse.json({ message: error.message , success: false , status: 500});
    }
}

export async function DELETE(request,{params}){
    try {
        const {id} = await params;

        await connectDB();

        const user = await checkAuth();

        if(!user) return NextResponse.json({ message: "Login First" , success: false , status: 401 });

        const taskboardDeleted = await TaskBoard.findOneAndDelete({_id:id , ownerId:user._id});
        const columnsDeleted = await Columns.deleteMany({boardId:id , createdBy:user._id});
        const tasksDeleted = await Tasks.deleteMany({boardId:id , createdBy:user._id});
        if(!taskboardDeleted || !columnsDeleted || !tasksDeleted) return NextResponse.json({ message: "TaskBoard not found" , success: false , status: 404 });

        return NextResponse.json({ message: "TaskBoard Deleted Successfully" , success: true , status: 200  });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: error.message , success: false , status: 500});
    }
}
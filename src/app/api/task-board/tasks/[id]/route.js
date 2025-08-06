import { checkAuth, connectDB } from "@/lib/features/serverFeatures";
import { Columns } from "@/lib/models/columns";
import { Tasks } from "@/lib/models/tasks";
import { NextResponse } from "next/server";

export async function GET(request,{params}){
    try {

        const {id} = await params;

        await connectDB();

        const user = await checkAuth();

        if(!user) return NextResponse.json({ message: "Login First" , success: false , status: 401 });

        const column = await Columns.findOne({_id:id});

        if(!column) return NextResponse.json({ message: "Column not found" , success: false , status: 404 });

        return NextResponse.json({ boardColumn : column , success: true , status: 200  });
    } catch (error) {
        return NextResponse.json({ message: error.message , success: false , status: 500});
    }
}

export async function PUT(request,{params}){
    try {

        const {status,columnId} = await request.json();
        const {id} = await params;

        if (!status) return NextResponse.json({ message: "Invalid Request",success: false,status: 400});
        if (!columnId) return NextResponse.json({ message: "Invalid Request",success: false,status: 400});

        await connectDB();

        const user = await checkAuth();

        if(!user) return NextResponse.json({ message: "Login First" , success: false , status: 401 });

        const updated = await Tasks.findOneAndUpdate({ _id: id, createdBy: user._id },{ status, columnId },{ new: true });

        if (!updated) return NextResponse.json({message: "Task not found",success: false,status: 404});

        return NextResponse.json({ message: `Task "${updated.title}" updated successfully` , success: true , status: 200  });
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

        const tasksDeleted = await Tasks.findOneAndDelete({_id:id , createdBy:user._id});

        if(!tasksDeleted) return NextResponse.json({ message: "Task not found" , success: false , status: 404 });

        return NextResponse.json({ message: "Task Deleted Successfully" , success: true , status: 200  });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: error.message , success: false , status: 500});
    }
}

export async function PATCH(request,{params}){
    try {

        const {id} = await params;

        await connectDB();

        const user = await checkAuth();

        if(!user) return NextResponse.json({ message: "Login First" , success: false , status: 401 });

        const task = await Tasks.findOne({_id:id , createdBy:user._id});
        if(!task) return NextResponse.json({ message: "Task not found" , success: false , status: 404 });

        task.isCompleted = !task.isCompleted;

        const updated  = await task.save();
        if(!updated) return NextResponse.json({ message: "Failed to Update Task" , success: false , status: 404 });

        return NextResponse.json({ message: "Task Updated Successfully" , success: true , status: 200  });
    } catch (error) {
         return NextResponse.json({ message: error.message , success: false , status: 500});
    }
}
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

        const {id} = await params;

        const requestData = await request.json();

        const taskData = requestData.taskData;

        if (!taskData.title || !taskData.description || !taskData.status || !taskData.priority || !taskData.deadline) return NextResponse.json({ message: "Please fill All the fields",success: false,status: 400});

        const order = taskData.priority === "High" ? 3 : taskData.priority === "Medium" ? 2 : 1;

        await connectDB();

        const user = await checkAuth();

        if(!user) return NextResponse.json({ message: "Login First" , success: false , status: 401 });

        const updated = await Tasks.findOneAndUpdate({ _id: id, createdBy: user._id },{ title:taskData.title, description:taskData.description, priority: taskData.priority, deadlineAt: taskData.deadline, labels: taskData.labels },{ new: true });

        if (!updated) return NextResponse.json({message: "Task not found",success: false,status: 404});

        return NextResponse.json({ message: `Task "${updated.title}" updated successfully` , success: true , status: 200  });
    } catch (error) {
        console.log(error);
         return NextResponse.json({ message: error.message , success: false , status: 500});
    }
}
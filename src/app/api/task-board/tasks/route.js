import Column from "@/components/server/Column";
import { checkAuth, connectDB } from "@/lib/features/serverFeatures";
import { Columns } from "@/lib/models/columns";
import { TaskBoard } from "@/lib/models/taskBoards";
import { Tasks } from "@/lib/models/tasks";
import { NextResponse } from "next/server";

export async function POST(request){

    try {
        const requestData = await request.json();

        const taskData = requestData.taskData;

        if (!taskData.title || !taskData.description || !taskData.status || !taskData.priority || !taskData.deadline) return NextResponse.json({ message: "Please fill All the fields",success: false,status: 400});

        const order = taskData.priority === "High" ? 3 : taskData.priority === "Medium" ? 2 : 1;
        
        await connectDB();
        
        const user = await checkAuth();
        
        if(!user) return NextResponse.json({ message: "Login First" , success: false , status: 401 });

        const taskBoard = await TaskBoard.findOne({_id:taskData.boardId});

        if(!taskBoard) return NextResponse.json({ message: "Unable To Find TaskBoard" , success: false , status: 401 });

        const column = await Columns.findOne({_id:taskData.columnId});

        if(!column) return NextResponse.json({ message: "Unable To Find Column" , success: false , status: 401 });

        const data = await Tasks.create({title:taskData.title, description: taskData.description, boardId: taskData.boardId , columnId: taskData.columnId, priority: taskData.priority, deadlineAt: taskData.deadline, labels: taskData.labels, createdBy: user._id, status: taskData.status,order:order});

        if(!data) return NextResponse.json({ message: "Failed to create Column" , success: false , status: 404 });
        return NextResponse.json({ taskBoard:taskBoard ,message: "Task Created Succesfully" , success: true , status: 201  });

    } catch (error) {
        console.log(error);
         return NextResponse.json({ message:error.message, success: false , status: 500 });
        
    }

}
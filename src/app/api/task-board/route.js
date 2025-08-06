import { checkAuth, connectDB } from "@/lib/features/serverFeatures";
import { Columns } from "@/lib/models/columns";
import { TaskBoard } from "@/lib/models/taskBoards";
import { NextResponse } from "next/server";

export async function GET(request){
    try{
        await connectDB();

        const user = await checkAuth();

        if(!user) return NextResponse.json({ message: "Login First" , success: false , status: 401 });

        const data = await TaskBoard.find({ownerId:user._id});
        if(!data) return NextResponse.json({ message: "TaskBoard not found" , success: false , status: 404 });
        return NextResponse.json({ taskBoards: data , success: true , status: 200  });
    }catch(error){
        return NextResponse.json({ message: error.message , success: false , status: 500});
    }
}

export async function POST(request){

    try {
        const requestData = await request.json();

        const boardName = requestData.boardName;
        const newColumns = requestData.newColumns;

        if (!boardName) return NextResponse.json({ message: "Please fill Board Name",success: false,status: 400});
        if (newColumns.length == 0) return NextResponse.json({ message: "Please Select Atleast One Column",success: false,status: 400});

        
        await connectDB();
        
        const user = await checkAuth();
        
        if(!user) return NextResponse.json({ message: "Login First" , success: false , status: 401 });

        const taskBoard = await TaskBoard.create({name:boardName,ownerId:user._id});

        const columnsData = newColumns.map((column, index) => ({
        name: column.name,
        order: index,
        boardId: taskBoard._id,
        createdBy: user._id
        }));

        const data = await Columns.insertMany(columnsData);

        if(!data) return NextResponse.json({ message: "Failed to create TaskBoard" , success: false , status: 404 });
        return NextResponse.json({ taskBoard:taskBoard, columns:data ,message: "TaskBoard Created Succesfully" , success: true , status: 201  });

    } catch (error) {
         return NextResponse.json({ message:error.message, success: false , status: 500 });
        
    }

}
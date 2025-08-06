import { checkAuth, connectDB } from "@/lib/features/serverFeatures";
import { Columns } from "@/lib/models/columns";
import { TaskBoard } from "@/lib/models/taskBoards";
import { NextResponse } from "next/server";

export async function POST(request){

    try {
        const requestData = await request.json();

        const columnName = requestData.columnName;
        const boardId = requestData.boardId;
        const order = requestData.order;

        if (!columnName) return NextResponse.json({ message: "Please fill Column Name",success: false,status: 400});
        if (!boardId) return NextResponse.json({ message: "Unable To Find TaskBoard",success: false,status: 400});

        
        await connectDB();
        
        const user = await checkAuth();
        
        if(!user) return NextResponse.json({ message: "Login First" , success: false , status: 401 });

        const taskBoard = await TaskBoard.findOne({_id:boardId});

        if(!taskBoard) return NextResponse.json({ message: "Unable To Find TaskBoard" , success: false , status: 401 });

        const data = await Columns.create({name:columnName,boardId:boardId,createdBy:user._id,order:order});

        if(!data) return NextResponse.json({ message: "Failed to create Column" , success: false , status: 404 });
        return NextResponse.json({ taskBoard:taskBoard ,message: "Column Created Succesfully" , success: true , status: 201  });

    } catch (error) {
        console.log(error);
         return NextResponse.json({ message:error.message, success: false , status: 500 });
        
    }

}


export async function PUT(request){
    try {

        const {boardId,newOrder} = await request.json();

        if(!boardId || !Array.isArray(newOrder)) return NextResponse.json({ message: "Invalid request",success: false,status: 400});
        console.log(boardId,newOrder);

        await connectDB();

        const user = await checkAuth();

        if(!user) return NextResponse.json({ message: "Login First" , success: false , status: 401 });

        await Promise.all(
            newOrder.map((columnId, index) =>
            Columns.findOneAndUpdate({ _id: columnId, boardId }, { order: index })
            )
        );

        return NextResponse.json({ success: true, message: "Columns reordered" });

    } catch (error) {
         return NextResponse.json({ message: error.message , success: false , status: 500});
    }
}

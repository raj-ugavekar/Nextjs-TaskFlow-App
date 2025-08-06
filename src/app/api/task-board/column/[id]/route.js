import { checkAuth, connectDB } from "@/lib/features/serverFeatures";
import { Columns } from "@/lib/models/columns";
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

        const {columnName} = await request.json();
        const {id} = await params;

        if (!columnName) return NextResponse.json({ message: "Please fill all fields",success: false,status: 400});

        await connectDB();

        const user = await checkAuth();

        if(!user) return NextResponse.json({ message: "Login First" , success: false , status: 401 });

        const updated = await Columns.findOneAndUpdate({ _id: id, createdBy: user._id },{ name:columnName },{ new: true });

        if (!updated) return NextResponse.json({message: "Column not found",success: false,status: 404});

        return NextResponse.json({ message: `Column "${updated.name}" updated successfully` , success: true , status: 200  });
    } catch (error) {
         return NextResponse.json({ message: error.message , success: false , status: 500});
    }
}

export async function DELETE(request,{params}){
    try {
        const {id} = await params;

        const {newOrder,boardId} = await request.json();
        console.log(newOrder);
        await connectDB();

        const user = await checkAuth();

        if(!user) return NextResponse.json({ message: "Login First" , success: false , status: 401 });

        const columnDeleted = await Columns.findOneAndDelete({_id:id , createdBy:user._id});
        // // const tasksDeleted = await tasks.findOneAndDelete({_id:id , userId:user._id});
        if(!columnDeleted) return NextResponse.json({ message: "Column not found" , success: false , status: 404 });

        await Promise.all(
          newOrder.map((columnId, index) =>
            Columns.findOneAndUpdate({ _id: columnId, boardId }, { order: index })
          )
        );

        return NextResponse.json({ message: "Column Deleted Successfully" , success: true , status: 200  });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: error.message , success: false , status: 500});
    }
}
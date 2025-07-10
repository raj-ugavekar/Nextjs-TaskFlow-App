import { checkAuth, connectDB } from "@/lib/features/serverFeatures";
import { Todos } from "@/lib/models/todos";
import { NextResponse } from "next/server";

export async function GET(request,{params}){
    try {

        const {id} = await params;

        await connectDB();

        const user = await checkAuth();

        if(!user) return NextResponse.json({ message: "Login First" , success: false , status: 401 });

        const data = await Todos.findOne({_id:id , userId:user._id});
        if(!data) return NextResponse.json({ message: "Todo not found" , success: false , status: 404 });
        return NextResponse.json({ todos: data , success: true , status: 200  });
    } catch (error) {
        return NextResponse.json({ message: error.message , success: false , status: 500});
    }
}

export async function PUT(request,{params}){
    try {

        const {name,deadlineAt} = await request.json();
        const {id} = await params;

        if (!name || !deadlineAt) return NextResponse.json({ message: "Please fill all fields",success: false,status: 400});

        await connectDB();

        const user = await checkAuth();

        if(!user) return NextResponse.json({ message: "Login First" , success: false , status: 401 });
        console.log(name,deadlineAt);
        const updated = await Todos.findOneAndUpdate({ _id: id, userId: user._id },{ name, deadlineAt },{ new: true });
        console.log(updated);

        if (!updated) return NextResponse.json({message: "Todo not found",success: false,status: 404});

        return NextResponse.json({ message: `Todo "${updated.name}" updated successfully` , success: true , status: 200  });
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

        const deleted = await Todos.findOneAndDelete({_id:id , userId:user._id});
        if(!deleted) return NextResponse.json({ message: "Todo not found" , success: false , status: 404 });

        return NextResponse.json({ message: "Todo Deleted Successfully" , success: true , status: 200  });
    } catch (error) {
        return NextResponse.json({ message: error.message , success: false , status: 500});
    }
}

export async function PATCH(request,{params}){
    try {

        const {id} = await params;

        await connectDB();

        const user = await checkAuth();

        if(!user) return NextResponse.json({ message: "Login First" , success: false , status: 401 });

        const todo = await Todos.findOne({_id:id , userId:user._id});
        if(!todo) return NextResponse.json({ message: "Todo not found" , success: false , status: 404 });

        todo.isCompleted = !todo.isCompleted;

        const updated  = await todo.save();
        if(!updated) return NextResponse.json({ message: "Failed to Update Todo" , success: false , status: 404 });

        return NextResponse.json({ message: "Todo Updated Successfully" , success: true , status: 200  });
    } catch (error) {
         return NextResponse.json({ message: error.message , success: false , status: 500});
    }
}
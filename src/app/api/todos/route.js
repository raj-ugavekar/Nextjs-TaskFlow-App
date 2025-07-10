import { checkAuth, connectDB } from "@/lib/features/serverFeatures";
import { Todos } from "@/lib/models/todos";
import { NextResponse } from "next/server";

export async function GET(request){
    try{
        await connectDB();

        const user = await checkAuth();

        if(!user) return NextResponse.json({ message: "Login First" , success: false , status: 401 });

        const data = await Todos.find({userId:user._id});
        if(!data) return NextResponse.json({ message: "Todo not found" , success: false , status: 404 });
        return NextResponse.json({ todos: data , success: true , status: 200  });
    }catch(error){
        return NextResponse.json({ message: error.message , success: false , status: 500});
    }
}

export async function POST(request,{params}){

    try {

        const {name,deadlineAt} = await request.json();

        console.log(deadlineAt);

        if (!name || !deadlineAt) return NextResponse.json({ message: "Please fill all fields",success: false,status: 400});

        
        await connectDB();
        
        const user = await checkAuth();
        
        if(!user) return NextResponse.json({ message: "Login First" , success: false , status: 401 });

        console.log(name,deadlineAt);
        const data = await Todos.create({name,deadlineAt,userId:user._id});
        console.log(data);
        if(!data) return NextResponse.json({ message: "Failed to create Todo" , success: false , status: 404 });
        return NextResponse.json({ message: "Todo Created Succesfully" , success: true , status: 201  });

    } catch (error) {
         return NextResponse.json({ message:error.message, success: false , status: 500 });
        
    }

}
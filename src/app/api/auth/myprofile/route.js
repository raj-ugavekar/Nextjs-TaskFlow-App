import { checkAuth, connectDB } from "@/lib/features/serverFeatures";
import { NextResponse } from "next/server";

export async function GET(request){
    try{
        await connectDB();

        const user = await checkAuth();

        if(!user) return NextResponse.json({ message: "Login First" , success: false , status: 401 });

        return NextResponse.json({ user: {_id: user._id,name: user.name,email: user.email} , success: true , status: 200  });
    }catch(error){
        return NextResponse.json({ message: error.message , success: false , status: 500});
    }
}
import { connectDB, cookieSetter, generateToken } from "@/lib/features/serverFeatures";
import { User } from "@/lib/models/user";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request,{params}){

    try {

        const {name,email,password} = await request.json();

        if (!name || !email || !email.includes("@") || !password || password.length < 6) {
            return NextResponse.json({ message: "Please fill all fields properly", success: false, status: 400,});
        }

        await connectDB();

        let user = await User.findOne({email});

        if(user) return NextResponse.json({ message: "User Already Registered" , success: false , status: 401 });

        const hashPassword = await hash(password,10);

        user = await User.create({name,email,password:hashPassword});

        if(!user) return NextResponse.json({ message: "Failed to Register" , success: false , status: 401 });

        const token = generateToken(user._id);

        await cookieSetter(token,true);

        return NextResponse.json({ user: {_id: user._id,name: user.name,email: user.email} ,message: "Registered Succesfully" , success: true , status: 201  });

    } catch (error) {
         return NextResponse.json({ message:error.message, success: false , status: 500 });
        
    }

}
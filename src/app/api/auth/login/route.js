import { connectDB, cookieSetter, generateToken } from "@/lib/features/serverFeatures";
import { User } from "@/lib/models/user";
import { compare } from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request,{params}){

    try {

        const {email,password} = await request.json();

        if (!email || !email.includes("@") || !password || password.length < 6) {
            return NextResponse.json({ message: "Invalid email or password", success: false, status: 400,});
        }

        await connectDB();

        const user = await User.findOne({email}).select("+password");

        if(!user) return NextResponse.json({ message: "Invalid Email" , success: false , status: 401 });

        const isMatchPassword = await compare(password,user.password);

        if(!isMatchPassword) return NextResponse.json({ message: "Invalid Password" , success: false , status: 401 });

        const token = generateToken(user._id);

        await cookieSetter(token,true);

        return NextResponse.json({ user: {_id: user._id,name: user.name,email: user.email} , message: `Welcome Back, ${user.name}` , success: true , status: 200  });

    } catch (error) {
         return NextResponse.json({ message:error.message, success: false , status: 500 });
        
    }

}
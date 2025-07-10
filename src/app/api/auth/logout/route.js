import { cookieSetter } from "@/lib/features/serverFeatures";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        await cookieSetter(null,false);
        return NextResponse.json({ message: "Logged out Sucessfully" , success: true , status: 200  });
    } catch (error) {
        return NextResponse.json({ message: error.message , success: false , status: 500});
    }
}
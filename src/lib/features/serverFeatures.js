import { sign, verify } from "jsonwebtoken"
import { cookies } from "next/headers";
import { User } from "../models/user";
import mongoose from "mongoose";

export async function connectDB(){

    if (mongoose.connections[0].readyState) return;

    const {connection} = await mongoose.connect(process.env.MONGO_DB_URL,{
        dbName:"TodoNext"
    });

    console.log("Connected To MongoDB");
}

export const cookieSetter = async (token, set) => {
  const cookieStore = await cookies();

  cookieStore.set({
    name: "token",
    value: set ? token : "",
    httpOnly: true,
    path: "/",
    maxAge: set ? 24 * 60 * 60 : 0,
  });
};


export const generateToken= (id)=>{

    return sign({id},process.env.JWT_SECRET);
}

export const checkAuth = async () => {
  const cookieStore = await cookies();
  
  const tokenCookie = cookieStore.get("token");
  if (!tokenCookie) return null;

  const token = tokenCookie.value;
  if (!token) return null;

  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    return await User.findById(decoded.id);
  } catch (err) {
    return null;
  }
};
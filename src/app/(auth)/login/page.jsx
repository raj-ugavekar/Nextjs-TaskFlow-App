"use client";

import { useUserContext } from "@/components/clients/ContextProvider";
import { initPush } from "@/lib/features/initPushNotifications";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function LoginPage() {

    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const {user,setUser} = useUserContext();

    const router = useRouter();

    const handleLogin = async(e)=>{
        e.preventDefault();

        if (!email.trim() || !password.trim()) return toast.error("Please fill all the fields");

        const toastId = toast.loading("Logging In...");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/login",{
            method:"POST",
            body:JSON.stringify({email,password}),
            headers:{
                "Content-Type":"application/json"
            }
            })

            if(!res.ok)  return toast.error(res.statusText,{
            id:toastId
            });

            const data = await res.json();

            if(!data.success) return toast.error(data.message,{
            id:toastId
            });

            setEmail("");
            setPassword("");
            
            toast.success(data.message,{
              id:toastId
            })
            setUser(data.user);
            initPush();
            router.replace("/");
        } catch (error) {
          toast.error(error.message);
        } finally {
          setLoading(false);
        }
    }

  return (
    <div className="min-h-screen flex justify-center items-start pt-12 bg-[#172842] px-4">
      <div className="w-[90%] max-w-md rounded-lg shadow-lg p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center text-white">
          Log In to Your Account
        </h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="email"
              id="email"
              value={email} disabled={loading}
              onChange={(e)=>setEmail(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-black/10 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-1 focus:ring-blue-400"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <input
              type="password"
              id="password"
              value={password} disabled={loading}
              onChange={(e)=>setPassword(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-black/10 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-1 focus:ring-blue-400"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 font-semibold rounded-lg transition duration-200 ${
              loading ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"} text-white`}
          >
            {loading ? "Logging In..." : "Log In"}
          </button>
        </form>
        <p className="text-sm text-center text-white/80">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-blue-300 font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

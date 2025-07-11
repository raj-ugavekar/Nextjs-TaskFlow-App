"use client";

import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import { useUserContext } from "./ContextProvider";

export const LogoutBtn=({className})=> {

  const router = useRouter();

  const {user,setUser} = useUserContext();

  const logoutHandler = async() => {
        const toastId = toast.loading("Logging Out...");
    try {
        const res = await fetch("/api/auth/logout");

        if(!res.ok) return toast.success(res.statusText,{
          id:toastId
        });

        const data = await res.json();

        if(!data.success) return toast.success(data.message,{
          id:toastId
        });
        toast.success(data.message,{
          id:toastId
        });

        setUser({});
        
        router.replace("/login");

    } catch (error) {
        return toast.success(error.message,{
          id:toastId
        });
    }
  }

  return (
    <button
      className={`inline-block ${className}`}
      onClick={logoutHandler}
    >
      Logout
    </button>
  )
}


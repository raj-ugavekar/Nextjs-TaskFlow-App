"use client";

import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import { useUserContext } from "./ContextProvider";

export const LogoutBtn=({className})=> {

  const router = useRouter();

  const {user,setUser} = useUserContext();

  const logoutHandler = async() => {
    try {
        const res = await fetch("/api/auth/logout");

        if(!res.ok) return toast.success(res.statusText);

        const data = await res.json();

        if(!data.success) return toast.success(data.message);
        toast.success(data.message);

        setUser({});
        
        router.replace("/login");

    } catch (error) {
        return toast.success(error.message);
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


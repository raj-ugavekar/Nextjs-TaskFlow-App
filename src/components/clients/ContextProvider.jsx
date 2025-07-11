"use client";

import { createContext,  useContext, useEffect, useState } from "react"
import { Toaster } from "react-hot-toast";

const userContext = createContext({
  user: {}
});

export const useUserContext =()=>{
    return useContext(userContext);
}

export const ContextProvider=({children})=>{
    
    const [user,setUser] = useState({});

    useEffect(() => {
    const controller = new AbortController();

    fetch("/api/auth/myprofile", { signal: controller.signal })
        .then((res) => res.json())
        .then((data) => setUser(data.user))

    return () => controller.abort();
    }, []);

    useEffect(() => {
    fetch("/api/auth/myprofile")
        .then((res) => res.json())
        .then((data) => {
        if (data.user?._id) {
            setUser(data.user);
        }
        });
    }, []);

    return (
        <userContext.Provider value={{user,setUser}}>
            {children}
            <Toaster/>
        </userContext.Provider>
    )
}
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
    const [loadingUser, setLoadingUser] = useState(true);

    useEffect(() => {
    const controller = new AbortController();

    fetch("/api/auth/myprofile", { signal: controller.signal })
        .then((res) => res.json())
        .then((data) => setUser(data.user || null))
        .finally(() => setLoadingUser(false));

    return () => controller.abort();
    }, []);

    return (
        <userContext.Provider value={{user,setUser,loadingUser}}>
            {children}
            <Toaster/>
        </userContext.Provider>
    )
}
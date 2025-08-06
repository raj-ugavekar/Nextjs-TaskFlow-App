import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/lib/store/authSlice";
import boardReducer from "@/lib/store/boardSlice";



export const store = configureStore({
    reducer:{
        auth: authReducer,
        board: boardReducer
    }
})
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react"
import toast from "react-hot-toast";

export default function DropArea({column}){
    const [showArea,setShowArea] = useState(false);
    const [loading,setLoading] = useState(false);

    const router = useRouter();

    const handleOnDrop=async(e)=>{

        const taskId = e.dataTransfer.getData("taskId");
        const taskColumn = e.dataTransfer.getData("taskColumn");
        
        if(!taskId || !taskColumn) {
            setShowArea(false);
            return toast.error("Drop Task Here...");
        }

        if(taskColumn == column._id) {
            setShowArea(false);
            return;
        };

        const toastId = toast.loading("Updating task status...");
        setLoading(true);

        try {
            const res = await fetch(`/api/task-board/tasks/${taskId}`, {
                method: "PUT",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({
                columnId: column._id,
                status: column.name,
                }),
            });

            if (!res.ok) {
                return toast.error(res.statusText, { id: toastId });
            }

            const data = await res.json();

            if (!data.success) {
                return toast.error(data.message, { id: toastId });
            }

            toast.success(data.message, { id: toastId });
            router.refresh();
            setShowArea(false);
            } catch (error) {
            toast.error(error.message, { id: toastId });
            } finally {
            setLoading(false);
            }

    }


    return (
    <div className={showArea ? "border-2 h-28 border-dashed hover:bg-blue-500/20 opacity-100 rounded-lg mt-6 flex justify-center items-center text-gray-500" : "opacity-0"} onDragEnter={()=>setShowArea(true)} onDragLeave={()=>setShowArea(false)} onDrop={(e)=>handleOnDrop(e)} onDragOver={(e)=> {e.preventDefault()}}>Drop Task Here</div>
    )
}
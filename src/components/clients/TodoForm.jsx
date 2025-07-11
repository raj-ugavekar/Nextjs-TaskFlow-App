"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useUserContext } from "./ContextProvider";

const TodoForm =()=> {
  const [name, setName] = useState("");
  const [deadlineAt, setDeadlineAt] = useState("");

  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  const {user} = useUserContext();

  const  onAddClicked = async(e) => {
    e.preventDefault();

    if (!name.trim() || !deadlineAt.trim()) return toast.error("Please fill both the fields");

    const localDate = new Date(deadlineAt);
    const deadline = localDate.toISOString();

    const toastId = toast.loading("Creating Todo...");
    setLoading(true);
      try {
        const res = await fetch("/api/todos",{
          method:"POST",
          body:JSON.stringify({name,deadlineAt:deadline}),
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

        setName("");
        setDeadlineAt("");
        toast.success(data.message,{
          id:toastId
        })
        router.refresh();
      } catch (error) {
        return toast.error(error.message,{
              id:toastId
        });
      } finally {
        setLoading(false);
      }
  };

  return (
    <form onSubmit={onAddClicked} className="flex gap-3">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter todo..."
        disabled={loading}
        aria-label="Todo name"
        maxLength={100}
        className="w-full border border-black/10 italic rounded-lg px-3 outline-none duration-150 bg-white/20 py-1.5"
      />
    <input
      type="datetime-local"
      value={deadlineAt}
      disabled={loading}
      onChange={(e) => setDeadlineAt(e.target.value)}
      placeholder="Select deadline..."
      aria-label="Deadline date"
      maxLength={100}
      className="w-1/2 border border-black/10 italic rounded-lg px-3 outline-none duration-150 bg-white/20 py-1.5"
    />
      
      <button
        type="submit" disabled={loading}
        className="rounded-lg px-3 py-1 bg-green-600 italic text-white shrink-0"
      >
        {loading ? "Adding..." : "Add"}
      </button>
    </form>
  );
}

export default TodoForm;
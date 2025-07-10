"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const TodoItem=({ todo })=> {

  const router = useRouter();
  
  const [name, setName] = useState(todo.name);
  const [deadlineAt, setDeadlineAt] = useState(todo.deadlineAt ? toLocalDateTimeInputValue(todo.deadlineAt) : "");
  const [isEditable, setIsEditable] = useState(false);
  const [loading, setLoading] = useState(false);

  function toLocalDateTimeInputValue(utcDateString) {
  const date = new Date(utcDateString);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
}
  
  const DeadLineDateTime = new Date(deadlineAt).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const editTodo = async(id) => {
    
    try {

      if (!name.trim() || !deadlineAt.trim()) return toast.error("Please fill both the fields");

      const localDate = new Date(deadlineAt);
      const deadline = localDate.toISOString();

      const toastId = toast.loading("Updating Todo...");
      setLoading(true);

      const res = await fetch(`/api/todos/${id}`,{
        method:"PUT",
        body:JSON.stringify({name,deadlineAt:deadline}),
        headers:{
          "Content-Type":"application/json"
        }
      })

      if(!res.ok) return toast.error(res.statusText,{
          id:toastId
        });

      const data = await  res.json();

      if(!data.success) return toast.error(data.message,{
          id:toastId
      });
      
      setIsEditable(false);
      toast.success(data.message,{
          id:toastId
      })
      router.refresh();
    } catch (error) {
      return toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleCompleted = async(id) => {
    if (!isEditable) {
      const toastId = toast.loading("Updating Todo...");
      setLoading(true);
      try {
        const res = await fetch(`/api/todos/${id}`, {
        method: "PATCH",
        });

        if(!res.ok) return toast.error(res.statusText,{
            id:toastId
          });

        const data = await res.json();

        if(!data.success) return toast.error(data.message,{
            id:toastId
        });

        toast.success(data.message,{
          id:toastId
        })

        router.refresh();
      } catch (error) {  
        return toast.error(error.message);
      } finally {
      setLoading(false);
      }
    }
  };

  const handleEditClick = () => {
    if (todo.isCompleted) return;
    if (isEditable) {
      editTodo(todo._id);
    } else {
      setIsEditable(true);
    }
  };

  const handleDeleteClick = async(id) =>{

    const toastId = toast.loading("Deleting Todo...");
    setLoading(true);
    try {
      const res = await fetch(`/api/todos/${id}`,{
        method:"DELETE"
      })

      if(!res.ok) return toast.error(res.statusText,{
            id:toastId
       });

      const data = await res.json();

      if(!data.success) return toast.error(data.message,{
            id:toastId
       });

      toast.success(data.message,{
          id:toastId
        })

      router.refresh();
    } catch (error) {
      return toast.error(error.message);
    } finally {
      setLoading(false);
      }

  }
  return (
<div
  className={`flex flex-col gap-1 sm:grid sm:grid-cols-[auto_1fr_auto_auto] sm:items-center border border-b-0 rounded-lg rounded-b-none px-4 py-3 shadow-sm duration-300 text-black
    ${todo.isCompleted ? "bg-[#c6e9a7]" : "bg-[#ccbed7]"}
  `}
>
  <div className="flex items-center justify-between gap-2 sm:col-span-2">
    <div className="flex items-center gap-2 flex-1 min-w-0">
      <input
        type="checkbox"
        className="cursor-pointer shrink-0 order-2 sm:order-1"
        onChange={() => toggleCompleted(todo._id)}
        checked={todo.isCompleted}
        disabled={loading}
        aria-label="Toggle complete"
      />
      {isEditable ? (
        <input
          type="text"
          className={`w-full bg-transparent italic order-1 sm:order-2 border-b border-white/20 focus:outline-none focus:ring-0`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
        />
      ) : (
        <span
          className={`w-full truncate order-1 italic sm:order-2 text-base font-semibold  ${todo.isCompleted ? "opacity-60 italic line-through" : ""}`}
        >
          {name}
        </span>
      )}
    </div>
  </div>

  <div className="flex items-center justify-between gap-2 sm:col-span-2">
    {isEditable ? (
      <input
        type="datetime-local"
        className="bg-transparent italic border-b border-white/20 focus:outline-none focus:ring-0"
        value={deadlineAt}
        onChange={(e) => setDeadlineAt(e.target.value)}
        disabled={loading}
      />
    ) : (
      <span className={`text-sm font-medium sm:font-semibold italic  ${todo.isCompleted ? "opacity-60 italic line-through" : "opacity-90"}`}>
        {DeadLineDateTime}
      </span>
    )}
    <div className="flex gap-2">
      <button
        onClick={handleEditClick}
        disabled={todo.isCompleted || loading}
        aria-label={isEditable ? "Save todo" : "Edit todo"}
        className=" text-base md:text-lg hover:text-blue-300 transition not-italic"
      >
        {isEditable ? "📁" : "✏️"}
      </button>
      <button
        onClick={() => handleDeleteClick(todo._id)}
        disabled={loading}
        aria-label="Delete todo"
        className="text-base md:text-lg hover:text-red-300 transition not-italic"
      >
        ❌
      </button>
    </div>
  </div>
</div>
  );
}

export default TodoItem;

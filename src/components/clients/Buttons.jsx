"use client";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "@/lib/store/authSlice";
import { useRouter } from "next/navigation";
import { AddColumnForm, CreateBoardForm, CreateTaskForm } from "./Forms";

// Logout Button
export const LogoutButton=({className})=> {

  const router = useRouter();

  const dispatch = useDispatch();

  const user = useSelector((state)=> state.auth.user);

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

        dispatch(clearUser());
        
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

// Create New Board Button
export const CreateBoardButton =()=> {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowForm(true)}
        className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 transition shadow-sm text-sm font-medium"
      >
        Create New Board
      </button>
      {showForm && <CreateBoardForm showForm={showForm} closeForm={()=>setShowForm(false)} /> }
    </>
  );
}

// Create New Column Button
export const AddColumnDesktopButton = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowForm(true)}
        className="flex flex-col justify-center items-center w-full min-h-96 border-2 border-dashed border-white/30 rounded-lg hover:border-blue-400 transition group"
      >
        <div className="flex justify-center items-center w-12 h-12 rounded-full border border-white/40 group-hover:border-blue-400 group-hover:bg-blue-500/20 transition">
          <span className="text-2xl text-white group-hover:text-blue-400">+</span>
        </div>
        <p className="mt-3 text-sm text-white/70 group-hover:text-white">
          Add New Column
        </p>
      </button>

      <AddColumnForm
        showForm={showForm}
        closeForm={() => setShowForm(false)}
      />
    </>
  );
};

// Create New Column Button
export const AddColumnMobileButton = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowForm(true)}
        className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 transition shadow-sm text-sm font-medium"
      >
        Add New Column
      </button>

      <AddColumnForm
        showForm={showForm}
        closeForm={() => setShowForm(false)}
      />
    </>
  );
};

// Create New Task Button
export const AddTaskButton =()=> {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowForm(true)}
        className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 transition shadow-sm text-sm font-medium"
      >
        Add New Task
      </button>
      {showForm && <CreateTaskForm showForm={showForm} closeForm={()=>setShowForm(false)} /> }
    </>
  );
}

// Update Task Button

export const TaskUpdateButton = ({ task }) => {
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showForm,setShowForm] = useState(false);

  const router = useRouter();

    const menuRef = useRef(null);
  
    useEffect(() => {
      function handleClickOutside(e) {
        if (menuRef.current && !menuRef.current.contains(e.target)) {
          setShowMenu(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

  const boardColumns = useSelector((state) => state.board.activeBoard?.columns);

  const handleStatusChange = async (newColumnId, newStatus) => {

    const toastId = toast.loading("Updating task status...");
    setLoading(true);

    try {
      const res = await fetch(`/api/task-board/tasks/${task._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          columnId: newColumnId,
          status: newStatus,
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
      setShowMenu(false);
    } catch (error) {
      toast.error(error.message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = async () => {
    const toastId = toast.loading("Deleting task...");
    setLoading(true);

    try {
      const res = await fetch(`/api/task-board/tasks/${task._id}`, {
        method: "DELETE",
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
      setShowMenu(false);
    } catch (error) {
      toast.error(error.message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

    const toggleCompleted = async() => {
        const toastId = toast.loading("Updating Task...");
        setLoading(true);
        try {
          const res = await fetch(`/api/task-board/tasks/${task._id}`, {
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
  
          setShowMenu(false);
          router.refresh();
        } catch (error) {  
          toast.error(error.message,{
            id:toastId
          });
        } finally {
        setLoading(false);
        }
    };

  return (
    <>
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setShowMenu((prev) => !prev)} 
        className="p-2 text-lg rounded hover:bg-white/10 transition font-bold not-italic"
        disabled={loading}
      >
        ⋮
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-[#172842] border border-white/10 rounded-md shadow-lg z-20 p-2">
          {boardColumns?.length > 0 && (
            <select
            disabled={loading}
              defaultValue={task.columnId}
              onChange={(e) => {
                const selectedOption = e.target.selectedOptions[0]; 
                const selectedColumnId = selectedOption.value;
                const selectedColumnName = selectedOption.text;
                handleStatusChange(selectedColumnId, selectedColumnName);
              }}
              className="bg-[#172842] w-full mb-2 px-3 py-2 rounded-md border border-white/10 text-white text-sm"
            >
              {boardColumns.map((column) => (
                <option key={column._id} value={column._id}>
                  {column.name}
                </option>
              ))}
            </select>
          )}
          <button onClick={toggleCompleted} className="block w-full text-left border-b border-white/10 px-4 py-2 hover:bg-white/10 text-sm" disabled={loading}>{task.isCompleted ? "Mark 'Pending'" : "Mark 'Completed'"}</button>
          <button
            onClick={() => setShowForm(true)}
            disabled={loading || task.isCompleted}
            className="block w-full text-left border-b border-white/10 px-4 py-2 hover:bg-white/10 text-sm"
          >
            Edit Task
          </button>

          <button
          disabled={loading}
            onClick={handleDeleteClick}
            className="block w-full text-left px-4 py-2 text-red-400 hover:bg-white/10 text-sm"
          >
            Delete Task
          </button>
        </div>
      )}
    </div>
      {showForm && <CreateTaskForm editForm={true} task={task} showForm={showForm} closeForm={()=>setShowForm(false)} /> }
    </>
  );
};

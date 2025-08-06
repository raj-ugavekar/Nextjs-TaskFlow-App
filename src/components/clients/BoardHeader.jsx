"use client"

import { updateBoard } from "@/lib/store/boardSlice";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

export default function BoardHeader({taskBoard}){

  const [loading,setLoading] = useState(false);
  const [editBoard, setEditBoard] = useState(false);

  const [boardName,setBoardName] = useState(taskBoard?.name);

  const [showMenu , setShowMenu] = useState(false);

  const router = useRouter();

  const dispatch = useDispatch();

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

  const handleDeleteClick =async (id)=>{

    const toastId = toast.loading("Deleting TaskBoard...");
    setLoading(true);
    try {
      const res = await fetch(`/api/task-board/${id}`, {
        method:"DELETE"
      });

      if(!res.ok)  return toast.error(res.statusText,{
        id:toastId
      });

      const data = await res.json();

      if(!data.success)  return toast.error(data.message,{
        id:toastId
      });

      toast.success(data.message,{
        id:toastId
      });
      router.replace("/task-board");
    } catch (error) {
      return toast.error(error.message,{
        id:toastId
      });
    } finally {
      setLoading(false);
    }
  }

    const handleEditClick = () => {
        if (editBoard) {
        editBoardFunc(taskBoard._id);
        } else {
        setEditBoard(true);
        setShowMenu(false);
        }
    };

    const editBoardFunc =async(id)=>{

      if(!boardName) return toast.error("Please fill the TaskBoard Name");

      const toastId = toast.loading("Updating TaskBoard...");
      setLoading(true);
      try {
        const res = await fetch(`/api/task-board/${id}`, {
          method:"PUT",
          body:JSON.stringify({boardName}),
          headers:{
            "Content-Type":"application/json"
          }
        });

        if(!res.ok)  return toast.error(res.statusText,{
          id:toastId
        });

        const data = await res.json();

        if(!data.success)  return toast.error(data.message,{
          id:toastId
        });

        toast.success(data.message,{
          id:toastId
        });
        setShowMenu(false);
        setEditBoard(false);
        dispatch(updateBoard({ id, name: boardName }));
        router.refresh();
      } catch (error) {
        return toast.error(error.message,{
          id:toastId
        });
      } finally {
        setLoading(false);
      }
    }

    return(
    <div className="w-fit">
      <div className="flex items-center gap-5 md:gap-3 relative">
        {editBoard ? (
          <input
            type="text"
            className="text-xl sm:text-2xl font-bold outline-2 outline-white/20 rounded px-2 bg-transparent border-b border-white/30 focus:outline-none"
            onChange={(e) => setBoardName(e.target.value)}
            value={boardName}
            disabled={loading}
            autoFocus
          />
        ) : (
          <h2 className="text-xl sm:text-2xl font-bold tracking-wide capitalize">
            {boardName}
          </h2>
        )}

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu((prev) => !prev)}
            className="p-2 text-xl rounded hover:bg-white/10 transition font-bold not-italic"
            disabled={loading}
          >
            ⋮
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-24 overflow-hidden overflow-x-auto bg-[#172842] border border-white/10 rounded-md shadow-lg z-10" >
              <button
                disabled={loading}
                onClick={handleEditClick}
                className="block w-full text-left border-b border-white/10 px-4 py-2 hover:bg-white/10"
              >
                {editBoard ? "Save" : "Edit"}
              </button>
              <button
                disabled={loading}
                onClick={() => handleDeleteClick(taskBoard._id)}
                className="block w-full text-left px-4 py-2 text-red-400 hover:bg-white/10"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      <p className="text-sm opacity-80 mt-1">
        Created On: {new Date(taskBoard?.createdAt).toDateString()}
      </p>
    </div>
    )

}
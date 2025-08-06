"use client"

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export default function ColumnHeader({column}){

  const [loading,setLoading] = useState(false);
  const [editColumn, setEditColumn] = useState(false);

  const [columnName,setColumnName] = useState(column.name);

  const columns = useSelector((state) => state.board.activeBoard?.columns);

  const [showMenu, setShowMenu] = useState(false);

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

    const handleDeleteClick =async (id)=>{

        const filtered = columns.filter((col) => col._id != id);
  
        const reorderedIds = filtered.map((col) => col._id);

        const toastId = toast.loading("Deleting Column...");
        setLoading(true);
        try {
            const res = await fetch(`/api/task-board/column/${id}`, {
            method:"DELETE",
            body:JSON.stringify({newOrder:reorderedIds,boardId:column.boardId})
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
            router.refresh();
        } catch (error) {
            return toast.error(error.message,{
                id:toastId
            });
        } finally {
            setLoading(false);
        }
    }


    const handleEditClick = () => {
        if (editColumn) {
        editColumnFunc(column._id);
        } else {
        setEditColumn(true);
        }
    };

    const editColumnFunc =async(id)=>{

        if(!columnName) return toast.error("Please fill the Column Name");

        const toastId = toast.loading("Updating Column...");
        setLoading(true);
        try {
            const res = await fetch(`/api/task-board/column/${id}`, {
            method:"PUT",
            body:JSON.stringify({columnName}),
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
            setEditColumn(false);
            router.refresh();
        } catch (error) {
            return toast.error(error.message,{
                id:toastId
            });
        } finally {
            setLoading(false);
        }

    }

    const changeColumnPosition=async(e)=>{
      const movingColumn = columns.find((col) => col._id === column._id);
      
      const filtered = columns.filter((col) => col._id != column._id);

      filtered.splice(parseInt(e.target.value), 0, movingColumn);
 
      const reorderedIds = filtered.map((col) => col._id);
        const toastId = toast.loading("Rearranging Columns...");
        setLoading(true);
        try {
            const res = await fetch(`/api/task-board/column/`, {
            method:"PUT",
            body:JSON.stringify({boardId: column.boardId, newOrder: reorderedIds}),
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
            router.refresh();
        } catch (error) {
            return toast.error(error.message,{
                id:toastId
            });
        } finally {
            setLoading(false);
        }
    }

    const handleDragColumn=async(e)=>{

      const columnId = e.dataTransfer.getData("columnId");

      if(!columnId) {
          return toast.error("Drop Task Here...");
      }

      if(columnId == column._id) return;

      const movingColumn = columns.find((col) => col._id === columnId);
      
      const filtered = columns.filter((col) => col._id != columnId);

      const position = columns.find((col)=> col._id == column._id);

      filtered.splice(position.order, 0, movingColumn);
      const reorderedIds = filtered.map((col) => col._id);
 
      const toastId = toast.loading("Rearranging Columns...");
      setLoading(true);
      try {
        const res = await fetch(`/api/task-board/column/`, {
          method:"PUT",
          body:JSON.stringify({boardId: column.boardId, newOrder: reorderedIds}),
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
          <div className="flex gap-6 items-center justify-center pb-3 border-b border-b-white/20" draggable onDragStart={(e)=>e.dataTransfer.setData("columnId",column._id)} onDragOver={(e)=>e.preventDefault()} onDrop={(e)=>handleDragColumn(e)}>
            { editColumn ? 
            <input type="text" className="outline-2 outline-white/20 rounded px-1" onChange={(e)=> setColumnName(e.target.value)} value={columnName} disabled={loading}/> 
            : <h2 className="tracking-wide capitalize font-semibold text-lg">
            { columnName}
            </h2>
            }
            <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu((prev) => !prev)}
            className="p-2 text-lg rounded hover:bg-white/10 transition font-bold not-italic"
            disabled={loading}
          >
            ⋮
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-32 bg-[#172842] border border-white/10 rounded-md shadow-lg z-10">
              <select
              value={column?.order}
              onChange={(e) => changeColumnPosition(e)}
              className="w-full px-4 py-1 rounded border bg-[#172842] text-white"
              >
              {columns.map((_, index) => (
                <option key={index} value={index} className={index === column.order ? "bg-[#095ad4]" : ""}>
                  {index+1}
                </option>
              ))}
              </select>
              <button
                onClick={handleEditClick}
                className="block w-full text-left border-b border-white/10 px-4 py-2 hover:bg-white/10"
              >
                {editColumn ? "Save" : "Edit"}
              </button>
              <button
                onClick={() => handleDeleteClick(column._id)}
                className="block w-full text-left px-4 py-2 text-red-400 hover:bg-white/10"
              >
                Delete
              </button>
            </div>
          )}
            </div>
          </div>
    )

}
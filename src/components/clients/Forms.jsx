"use client";

import { addBoard } from "@/lib/store/boardSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

// Create New Board Form
export const CreateBoardForm =({showForm,closeForm})=> {

    const [loading,setLoading] = useState(false);
    const [boardName ,setBoardName] = useState("");
    const [newColumns , setNewColumns] = useState([{id:1,name:"Todo"},{id:2,name:"Doing"},{id:3,name:"Done"} ]);

    const router = useRouter();
    const dispatch = useDispatch();

    const changeColumn = (id,newName)=>{
        setNewColumns((prevState)=> {
            const newState = [...prevState];
            const column = newState.find((col) => col.id === id);
            column.name = newName;
            return newState;
        })
    }

    const removeColumn=(id)=>{
        setNewColumns((prevState)=> prevState.filter((column)=> column.id !== id))
    }

    const handleSubmit =async(e)=>{
        e.preventDefault();
    
        if (!boardName.trim()) return toast.error("Please enter the Board Name");
        if (newColumns.length == 0) return toast.error("Please Add Atleast One Column");
                    
        const toastId = toast.loading("Creating New Board...");
        setLoading(true);

        try {
            const res = await fetch("/api/task-board",{
                method:"POST",
                body:JSON.stringify({boardName,newColumns}),
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
    
            setBoardName("");
            setNewColumns([{id:1,name:"Todo"},{id:2,name:"Doing"},{id:3,name:"Done"} ]);

            dispatch(addBoard(data.taskBoard));
                            
            toast.success(data.message,{
                  id:toastId
            })
            router.replace(`/task-board/${data.taskBoard._id}`);
            
        } catch (error) {
            return toast.error(error.message,{
                  id:toastId
            });
        } finally {
              setLoading(false);
        }
    }

 if(!showForm) return null;

  return (
    <>
    <div className="fixed inset-0 flex items-center justify-center text-white bg-black/40 bg-opacity-50 p-4 z-50">
      <div className="bg-[#172842] p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-bold text-white mb-4">Create New Board</h2>
        <div className="flex flex-col gap-4">
        <input
        className="mt-1 w-full px-3 py-2 border border-black/10 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-1 focus:ring-blue-400 transition-all"
        type="text"
        placeholder="Enter Task Board Name"
        value={boardName}
        disabled={loading}
        onChange={(e)=>setBoardName(e.target.value)}
        />
        <div className="flex flex-col gap-4">
            <label className="font-semibold">Board Columns</label>
            {
                newColumns.map((column,index)=>(
                    <div key={index} className="flex gap-3">
                        <input
                            className="mt-1 w-full px-3 py-2 border border-black/10 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-1 focus:ring-blue-400 transition-all"
                            type="text"
                            value={column.name}
                            onChange={(e)=>changeColumn(column.id,e.target.value)}
                            disabled = {loading}
                        />
                        <button disabled={loading} onClick={()=>removeColumn(column.id)} className="text-xl hover:text-blue-400 transition not-italic">
                            ✕
                        </button>
                    </div>
                ))
            }
            <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
            disabled={loading}
            onClick={()=> setNewColumns((prevState)=> prevState = [...prevState,{id:newColumns.length +1 , name:''}])}
          >
            Add Column
          </button>
        </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button className="bg-gray-400 hover:bg-gray-600 px-4 py-2 rounded-md" disabled={loading} onClick={closeForm}>
            Cancel
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            onClick={handleSubmit}
          >
            {loading ? "Creating..." : "Create Board"}
          </button>
        </div>
      </div>
    </div>
    </>
  );
}

// Create New Column Form
export const AddColumnForm =({showForm,closeForm})=> {

    const [loading,setLoading] = useState(false);
    const [columnName ,setColumnName] = useState("");

    const boardId = useSelector((state) => state.board.activeBoard?._id);
    const columns = useSelector((state) => state.board.activeBoard?.columns);

    const router = useRouter();

    const handleSubmit =async(e)=>{
        e.preventDefault();

        const order = columns.length;
    
        if (!columnName.trim()) return toast.error("Please fill the Column Name");
                    
        const toastId = toast.loading("Adding New Column...");
        setLoading(true);

        try {
            const res = await fetch("/api/task-board/column",{
                method:"POST",
                body:JSON.stringify({columnName,boardId,order}),
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
    
            setColumnName("");
            closeForm();
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
    }

 if(!showForm) return null;

  return (
    <>
    <div className="fixed inset-0 flex items-center justify-center text-white bg-black/40 bg-opacity-50 p-4 z-50">
      <div className="bg-[#172842] p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-bold text-white mb-4 text-left">Add New Column</h2>
        <div className="flex flex-col gap-4">
        <input
        className="mt-1 w-full px-3 py-2 border border-black/10 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-1 focus:ring-blue-400 transition-all"
        type="text"
        placeholder="Enter Column Name"
        value={columnName}
        onChange={(e)=>setColumnName(e.target.value)}
        />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button className="bg-gray-400 hover:bg-gray-600 px-4 py-2 rounded-md" onClick={closeForm}>
            Cancel
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            onClick={handleSubmit}
            disabled={loading}
          >
            Add Column
          </button>
        </div>
      </div>
    </div>
    </>
  );
}

// Create/Update Task Form
export const CreateTaskForm = ({editForm,showForm, closeForm, task }) => {
  const router = useRouter();

  const priorities = ["Low", "Medium", "High"];

  const [title, setTitle] = useState(task?.title || "");
  const [columnId, setColummnId] = useState(task?.columnId || "");
  const [description, setDescription] = useState(task?.description || "");
  const [status, setStatus] = useState(task?.status || "");
  const [priority, setPriority] = useState(task?.priority || "");
  const [deadlineAt, setDeadlineAt] = useState(task?.deadlineAt ? toLocalDateTimeInputValue(task?.deadlineAt) : "");
  const [loading,setLoading] = useState(false);

  const [labels, setLabels] = useState(task?.labels || []);

  function toLocalDateTimeInputValue(utcDateString) {
  const date = new Date(utcDateString);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
  }

  const boardId = useSelector((state) => state.board.activeBoard?._id);
  const boardColumns = useSelector((state) => state.board.activeBoard.columns);

  const changeLabel = (id, newName) => {
    setLabels((prev) =>
      prev.map((label) =>
        label.id === id ? { ...label, name: newName } : label
      )
    );
  };

  const removeLabel = (id) => {
    setLabels((prev) => prev.filter((label) => label.id !== id));
  };

  const handleAddSubmit = async () => {
    if (!title.trim()) return toast.error("Please enter a Task Title");
    if (!description.trim()) return toast.error("Please enter a Task Description");
    if (!status) return toast.error("Select a Status");
    if (!priority) return toast.error("Select a Priority");
    if (!deadlineAt) return toast.error("Select a Deadline");

    const localDate = new Date(deadlineAt);
    const deadline = localDate.toISOString();

    const taskData = {
      boardId,
      columnId,
      title,
      description,
      priority,
      deadline,
      status,
      labels: labels.filter((l) => l.name.trim() !== "")
    };

    const toastId = toast.loading("Creating New Task...");
    setLoading(true);

    try {
      const res = await fetch("/api/task-board/tasks",{
        method:"POST",
        body:JSON.stringify({taskData}),
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
    
      setTitle("");
      setDescription("");   
      setDeadlineAt("");
      setPriority("");
      setStatus("");
      setLabels([]);
      closeForm();

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

  const handleEditSubmit = async () => {
    if (!title.trim()) return toast.error("Please enter a Task Title");
    if (!description.trim()) return toast.error("Please enter a Task Description");
    if (!status) return toast.error("Select a Status");
    if (!priority) return toast.error("Select a Priority");
    if (!deadlineAt) return toast.error("Select a Deadline");

    const localDate = new Date(deadlineAt);
    const deadline = localDate.toISOString();

    const taskData = {
      boardId,
      columnId,
      title,
      description,
      status,
      priority,
      deadline,
      labels: labels.filter((l) => l.name.trim() !== "")
    };

    const toastId = toast.loading("Updating Task...");
    setLoading(true);

    try {
      const res = await fetch(`/api/task-board/tasks/task/${task._id}`,{
        method:"PUT",
        body:JSON.stringify({taskData}),
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
    
      setTitle("");
      setDescription("");   
      setDeadlineAt("");
      setPriority("");
      setStatus("");
      setLabels([]);
      closeForm();

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

  if (!showForm) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 bg-opacity-50 p-4 z-50">
      <div className="bg-[#172842] p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-bold text-white mb-4">{editForm ? "Edit Task" : "Create New Task"}</h2>

        <div className="flex flex-col gap-3">
          <input
            className="w-full px-3 py-2 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-1 focus:ring-blue-400"
            type="text"
            placeholder="Enter Task Title"
            value={title}
            disabled={loading}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="w-full px-3 py-2 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-1 focus:ring-blue-400"
            placeholder="Enter Description"
            rows={3}
            disabled={loading}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {
            !editForm &&  <select
            value={columnId}
            disabled={loading}
            onChange={(e) => {
              const selectedOption = e.target.selectedOptions[0]; 
              const selectedColumnId = selectedOption.value;
              const selectedColumnName = selectedOption.text;

              setColummnId(selectedColumnId);
              setStatus(selectedColumnName);
            }}
            id="status"
            className="bg-[#172842] w-full px-3 py-2 rounded-lg border border-black/10 text-white focus:outline-none focus:ring-1 focus:ring-blue-400"
          >
            <option value="">Select Status</option>
            {boardColumns.map((column,index) => (
              <option key={column._id} value={column._id}>
                {column.name}
              </option>
            ))}
          </select>
          }
          <select
            value={priority}
            disabled={loading}
            onChange={(e) => setPriority(e.target.value)}
            className="bg-[#172842] w-full px-3 py-2 rounded-lg border border-black/10 text-white focus:outline-none focus:ring-1 focus:ring-blue-400"
          >
            <option value="">Select Priority</option>
            {priorities.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
          <input
            disabled={loading}
            type="datetime-local"
            value={deadlineAt}
            onChange={(e) => setDeadlineAt(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
          <div className="mt-3">
            <label className="block text-sm text-white/70 mb-2">
              Task Labels
            </label>
            {labels?.map((label) => (
              <div key={label.id} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={label.name}
                  onChange={(e) => changeLabel(label.id, e.target.value)}
                  disabled={loading}
                  placeholder="Label name"
                  className="flex-1 px-3 py-2 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
                <button
                  disabled={loading}
                  onClick={() => removeLabel(label.id)}
                  className="text-xl text-red-400 hover:text-red-500 transition"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
            onClick={()=> setLabels((prevState)=> prevState = [...prevState,{id:labels.length +1 , name:''}])}
          >
            Add Column
          </button>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button
            disabled={loading}
            className="bg-gray-400 hover:bg-gray-600 px-4 py-2 rounded-md"
            onClick={closeForm}
          >
            Cancel
          </button>
          {editForm ?  <button
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            onClick={handleEditSubmit}
          >
            {loading ? "Editing..." : "Edit Task"}
          </button> :
          <button
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            onClick={handleAddSubmit}
          >
            {loading ? "Creating..." : "Create Task"}
          </button>
          }
        </div>
      </div>
    </div>
  );
};
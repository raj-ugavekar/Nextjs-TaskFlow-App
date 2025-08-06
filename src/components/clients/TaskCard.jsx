"use client";
import { TaskUpdateButton } from "./Buttons";

export default function TaskCard({ task }) {
  const priorityColor = {
    High: "bg-red-500",
    Medium: "bg-yellow-500",
    Low: "bg-green-500",
  }[task.priority] || "bg-gray-500";

  return (
    <div className={`border rounded-lg p-3 bg-[#093475]  text-white shadow-sm hover:shadow-md transition`} draggable onDragStart={(e)=>{
      e.dataTransfer.setData("taskId",task._id);
      e.dataTransfer.setData("taskColumn",task.columnId);
    }}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{task.title}</h3>
        <div className="flex gap-2 items-center">
          <span className={`text-xs px-2 py-1 rounded ${priorityColor}`}>
            {task.priority}
          </span>
          <TaskUpdateButton task={task} />
        </div>
      </div>

      {task.description && (
        <p className="text-sm text-white/80 mt-1">{task.description}</p>
      )}

      {task.labels?.length > 0 && (
        <div className="flex gap-2 flex-wrap mt-2">
          {task.labels.map((label) => (
            <span
              key={label.id}
              className="text-xs px-2 py-1 rounded bg-blue-500/30 text-blue-300"
            >
              #{label.name}
            </span>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center text-xs text-white/60 mt-6">
        <span>{new Date(task.deadlineAt).toDateString()}</span>
        {task.isCompleted ? (
          <span className="text-green-400 font-bold">Completed</span>
        ) : (
          <span className="text-yellow-400">Pending</span>
        )}
      </div>
    </div>
  );
}

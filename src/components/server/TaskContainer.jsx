import DropArea from "../clients/DropArea";
import TaskCard from "../clients/TaskCard";


export default function TaskContainer({ column,tasks }) {

  const tasksData = tasks?.filter((task)=> task.columnId == column._id);

  return (
    <div className="flex flex-col gap-5">
      {
        tasksData?.length > 0 ? (
          tasksData?.map((task) => (
            <div key={task._id}>
            <TaskCard key={task._id} task={task} />
            <DropArea column = {column}/>
            </div>
          ))) : <DropArea column={column}/>
      }
    </div>
  );
}

import ColumnHeader from "../clients/ColumnHeader";
import TaskContainer from "./TaskContainer";


export default function Column({column,tasks}) {

  return (
    <div className="w-full space-y-10">
      <ColumnHeader column={column} />
      <TaskContainer column={column} tasks={tasks}/>
    </div>
  );
}

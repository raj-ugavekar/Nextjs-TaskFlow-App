import { AddColumnDesktopButton, AddColumnMobileButton } from "../clients/Buttons";
import Column from "./Column";


export default function BoardColumns({boardColumns,tasks}) {

  console.log(boardColumns);

  return (
    <>
    <div className="text-end md:hidden">
      <div className="w-full my-4">
        <AddColumnMobileButton/>
      </div>
    </div>
    <div className="relative w-full flex justify-center md:gap-6">
      <div className="w-[90%] md:w-11/12">
        <div className="flex flex-col md:flex-row justify-around md:justify-around gap-4 md:gap-6  pb-4">
          {boardColumns?.map((column) => (
            <Column key={column._id} column={column} tasks={tasks} />
          ))}
        </div>
      </div>
      <div className="w-[100px] md:flex justify-center items-center hidden">
        <div className="w-full">
            <AddColumnDesktopButton/>
        </div>
      </div>
    </div>
    </>
  );
}
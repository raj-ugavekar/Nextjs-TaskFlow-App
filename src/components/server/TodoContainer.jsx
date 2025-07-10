import { Suspense } from "react";
import TodoForm from "../clients/TodoForm";
import TodoList from "../clients/TodoList";

const TodoContainer =async()=>{

    return (
      <>
        <div className="mb-10 md:mb-12">
          <TodoForm />
        </div>
        <Suspense fallback={<div className="w-full text-center text-sm text-white/70 italic py-4">Loading Todos...</div>} >
          <TodoList/>
        </Suspense>
      </>
    )
}

export default TodoContainer;
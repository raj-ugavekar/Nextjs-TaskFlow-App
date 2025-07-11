import { cookies } from "next/headers";
import TodoItem from "../clients/TodoItem";
import RemainderTimeBar from "../clients/RemainderTimeBar";

export async function getTasks() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const res = await fetch(`${process.env.URL}/api/todos`, {
      headers: {
        Cookie: `token=${token}`
      },
      cache: "no-store"
    });

    if (!res.ok) {
      console.error("Fetch error:", res.statusText);
      return [];
    }

    const data = await res.json();

    if (!data.success) return [];

    return data.todos;
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
}

const TodoList = async()=>{

    const todos = await getTasks();

    return (
        <div className="flex flex-col gap-y-4">
              {
                todos?.length>0 ? (
                  todos?.map((todo) => (
                    <div key={todo._id} className="w-full">
                      <TodoItem todo={todo} />
                      <RemainderTimeBar deadline={todo.deadlineAt} isCompleted={todo.isCompleted} />
                    </div>
                  ))
                ) : <div className="w-full text-center text-sm text-white/70 italic py-4"> You have no todos yet. Start by adding one above.</div>
              }
        </div>
        
    )
}

export default TodoList;
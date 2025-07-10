"use client";

import { useEffect, useState } from "react";
import TodoItem from "./TodoItem";
import RemainderTimeBar from "./RemainderTimeBar";

export default function TodoList() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await fetch("/api/todos", {
          credentials: "include",
        });

        const data = await res.json();
        if (data.success) {
          setTodos(data.todos);
        }
      } catch (err) {
        return [];
      }
    };

    fetchTodos();
  }, []);

  return (
    <div className="flex flex-col gap-y-4">
      {todos.length > 0 ? (
        todos.map((todo) => (
          <div key={todo._id} className="w-full">
            <TodoItem todo={todo} />
            <RemainderTimeBar deadline={todo.deadlineAt} isCompleted={todo.isCompleted} />
          </div>
        ))
      ) : (
        <div className="w-full text-center text-sm text-white/70 italic py-4">
          You have no todos yet. Start by adding one above.
        </div>
      )}
    </div>
  );
}

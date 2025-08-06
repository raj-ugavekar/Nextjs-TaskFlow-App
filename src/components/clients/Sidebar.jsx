"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CreateBoardForm } from "./Forms";
import { useDispatch, useSelector } from "react-redux";
import { hydrateBoards } from "@/lib/store/boardSlice";

export default function Sidebar({ isOpen, toggleSidebar }) {
  const dispatch = useDispatch();
  const pathname = usePathname();

  const boardList = useSelector((state) => state.board.boards);

  const [showForm, setShowForm] = useState(false);

    const menuRef = useRef(null);
      
    useEffect(() => {
      function handleClickOutside(e) {
        if (menuRef.current && !menuRef.current.contains(e.target)) {
          toggleSidebar();
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

  useEffect(() => {
    if (!boardList || boardList.length === 0) {
      async function fetchBoards() {
        try {
          const res = await fetch("/api/task-board");
          const data = await res.json();

          if (res.ok && data.success) {
            dispatch(hydrateBoards(data.taskBoards));
          } else {
            dispatch(hydrateBoards([]));
          }
        } catch (error) {
          console.error("Fetch error:", error);
          dispatch(hydrateBoards([]));
        }
      }
      fetchBoards();
    }
  }, [dispatch]);

  return (
    <>
      <aside
        ref={menuRef}
        className={`
          absolute top-0 left-0 h-full w-64
          bg-[#172842] text-white
          transform transition-transform duration-300 ease-in-out z-30 
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-3 flex justify-between items-center border-b border-white/20">
          <h2 className="font-bold text-lg">Boards</h2>
          <button
            onClick={toggleSidebar}
            className="text-xl hover:text-blue-400 transition not-italic"
          >
            ✕
          </button>
        </div>
        <nav className="mt-4 px-3 space-y-2">
          <Link
            href={"/task-board"}
            onClick={toggleSidebar}
            className={`block px-4 py-2 rounded-md transition ${
              pathname === "/task-board"
                ? "bg-blue-600 text-white"
                : "hover:bg-white/10 text-white/80"
            }`}
          >
            Home
          </Link>
          {boardList?.map((board) => (
            <Link
              key={board._id}
              href={`/task-board/${board._id}`}
              onClick={toggleSidebar}
              className={`block px-4 py-2 rounded-md transition ${
                pathname === `/task-board/${board._id}`
                  ? "bg-blue-600 text-white"
                  : "hover:bg-white/10 text-white/80"
              }`}
            >
              {board.name}
            </Link>
          ))}
          <button
            onClick={() => {
              toggleSidebar();
              setShowForm(true);
            }}
            className="mt-6 w-full self-center px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 transition"
          >
            Add New Board
          </button>
        </nav>
      </aside>
      {showForm && (
        <CreateBoardForm showForm={showForm} closeForm={() => setShowForm(false)} />
      )}
    </>
  );
}

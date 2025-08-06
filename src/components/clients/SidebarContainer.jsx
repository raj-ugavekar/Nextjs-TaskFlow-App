"use client";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";

export default function SidebarContainer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      { !isOpen && <button
        onClick={() => setIsOpen(true)}
        className="absolute top-4 left-4 z-40 text-white text-2xl hover:text-blue-400 transition not-italic"
      >
        ☰
      </button>
        }
      <Sidebar isOpen={isOpen} toggleSidebar={() => setIsOpen(false)} />
    </>
  );
}

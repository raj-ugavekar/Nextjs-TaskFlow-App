"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { getNavItems } from "@/lib/features/clientFeatures";
import NotificationButton from "./NotificationBtn";
import { useSelector } from "react-redux";
import { LogoutButton } from "./Buttons";

export const DesktopNav=()=> {
  const user = useSelector((state)=> state.auth.user);
  const loadingUser = useSelector((state)=> state.auth.loading);

  const isLoggedIn = user?._id;

  const navItems = useMemo(() => getNavItems(isLoggedIn), [isLoggedIn]);

  const pathname = usePathname();

  if (loadingUser) {
   return null;
  }

  return (
    <>
    <nav className="hidden md:flex items-center space-x-8">
      {navItems.map(
        (item) =>
          item.active && (
            <Link
              key={item.name}
              href={item.route}
              className={`hover:text-blue-600 transition-colors font-medium ${pathname === item.route ? "text-blue-400" : ""}`}
            >
              {item.name}
            </Link>
          )
      )}
      {isLoggedIn && <LogoutButton className="hover:text-blue-600 transition-colors font-medium" />}
      {isLoggedIn && <div><NotificationButton/></div> }
    </nav>
    </>
  );
}

export const MobileNav =()=> {
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state)=> state.auth.user);
  const isLoggedIn = user?._id;

  const navItems = useMemo(() => getNavItems(isLoggedIn), [isLoggedIn]);

  const pathname = usePathname();

  const menuRef = useRef(null);
    
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
    <div className="md:hidden flex gap-4 justify-center items-center" ref={menuRef}>
      <div >
      {isLoggedIn && <div><NotificationButton/></div> }
      </div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-2xl not-italic text-gray-700 focus:outline-none"
        aria-label="Toggle Menu"
      >
        {isOpen ? "✕" : "☰"}
      </button>
    </div>
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out w-64 bg-[#172842] shadow-lg z-50 flex flex-col md:hidden`}
      >
        <div className="flex justify-between items-center px-4 py-3 border-b border-white/20">
          <span className="text-lg font-semibold pl-2 text-white">Menu</span>
          <button
            onClick={() => setIsOpen(false)}
            className="text-xl text-white not-italic"
          >
            ✕
          </button>
        </div>
        <nav className="flex flex-col space-y-2 p-4 ">
          {navItems.map(
            (item) =>
              item.active && (
                <Link
                  key={item.name}
                  href={item.route}
                  className={`hover:bg-white/10 px-3 py-2 rounded transition ${pathname === item.route ? "text-blue-400" : "text-white"}`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              )
          )}
          {isLoggedIn && (
            <LogoutButton className="text-white text-left hover:bg-white/10 px-3 py-2 rounded transition" />
          )}
        </nav>
      </div>
    </>
  );
}

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { LogoutBtn } from "./LogoutBtn";
import { useUserContext } from "./ContextProvider";
import { usePathname } from "next/navigation";
import { getNavItems } from "@/lib/features/clientFeatures";
import NotificationButton from "./NotificationBtn";

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUserContext();
  const isLoggedIn = user?._id;

  const navItems = useMemo(() => getNavItems(isLoggedIn), [isLoggedIn]);

  const pathname = usePathname();

  return (
    <>
    <div className="md:hidden flex gap-4 justify-center items-center">
      <div >
      <NotificationButton/>
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
            <LogoutBtn className="text-white text-left hover:bg-white/10 px-3 py-2 rounded transition" />
          )}
        </nav>
      </div>
    </>
  );
}

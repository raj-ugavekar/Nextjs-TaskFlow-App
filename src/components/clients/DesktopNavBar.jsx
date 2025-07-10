"use client";

import Link from "next/link";
import { LogoutBtn } from "./LogoutBtn";
import { useUserContext } from "./ContextProvider";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { getNavItems } from "@/lib/features/clientFeatures";
import NotificationButton from "./NotificationBtn";

export default function DesktopNav() {
  const { user } = useUserContext();
  const isLoggedIn = user?._id;

  const navItems = useMemo(() => getNavItems(isLoggedIn), [isLoggedIn]);

  const pathname = usePathname();

  return (
    <>
    <nav className="hidden md:flex space-x-8">
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
      {isLoggedIn && <LogoutBtn className="hover:text-blue-600 transition-colors font-medium" />}
      {isLoggedIn && <div><NotificationButton/></div> }
    </nav>
    </>
  );
}

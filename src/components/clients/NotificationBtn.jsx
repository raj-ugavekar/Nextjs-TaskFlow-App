"use client";

import { initPush } from "@/lib/features/initPushNotifications";
import { useState } from "react";
import toast from "react-hot-toast";
import { useEffect, useRef } from "react";
import { useUserContext } from "./ContextProvider";

export default function NotificationButton() {
  const [permission, setPermission] = useState("default");

  const { user } = useUserContext();
  const [showHint, setShowHint] = useState(false);
  const bellRef = useRef(null);

  const handleSubscribe = async () => {
    if (!("Notification" in window)) {
      toast.error("Browser does not support notifications.");
      return;
    }

    const result = await Notification.requestPermission();
    setPermission(result);

    if (result === "granted") {
      await initPush();
    } else if (result === "denied") {
      toast.error("Notifications blocked. Enable from browser settings.");
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      const currentPermission = Notification.permission;
      setPermission(currentPermission);

      if (currentPermission === "default" && user?._id) {
        setShowHint(true);
        const timeout = setTimeout(() => setShowHint(false), 5000);
        if (bellRef.current) {
          bellRef.current.focus();
        }
        return () => clearTimeout(timeout);
      }
    }
  }, [user]);

  return (
    <div className="relative">
      <button
        ref={bellRef}
        onClick={handleSubscribe}
        disabled={permission === "granted"}
        className={`text-xl transition hover:text-yellow-400 focus:outline-none ${
          permission === "granted" ? "hidden" : ""
        }`}
        title="Enable Notifications"
        aria-label="Enable Notifications"
      >
        🔔
      </button>

      {showHint && (
        <div className="absolute right-0 top-10 bg-white text-black text-xs rounded shadow-md px-3 py-2 z-50 w-56 animate-fade-in-up">
          🔔 Don't miss tasks — Click the bell icon to enable reminders!
        </div>
      )}
    </div>
  );

}

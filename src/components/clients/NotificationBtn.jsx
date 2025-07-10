"use client";

import { initPush } from "@/lib/features/initPushNotifications";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useUserContext } from "./ContextProvider";

export default function NotificationButton() {
  const [permission, setPermission] = useState("default");
  const { user } = useUserContext();
  const bellRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      const status = Notification.permission;
      setPermission(status);

      if (status === "default" && bellRef.current && user?._id) {
        bellRef.current.focus();
        bellRef.current.scrollIntoView({ behavior: "smooth" });
        toast("Click the 🔔 icon to enable task reminders");
      }
    }
  }, [user]);

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

  return (
    <button
      ref={bellRef}
      onClick={handleSubscribe}
      disabled={permission === "granted"}
      className={` transition ${
        permission === "granted" ? "hidden" : ""
      }`}
    >
      🔔
    </button>
  );
}

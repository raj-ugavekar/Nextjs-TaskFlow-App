"use client";

import { initPush } from "@/lib/features/initPushNotifications";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useUserContext } from "./ContextProvider";

export default function NotificationButton() {
  const [permission, setPermission] = useState("default");

  const {user} = useUserContext();

  const bellRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
    }
    if (Notification.permission === "default" && bellRef.current && user._id) {
        bellRef.current.focus();
        bellRef.current.scrollIntoView({ behavior: "smooth"});

        toast("Click the 🔔 icon to enable task reminders");
    }
  }, []);

  const handleSubscribe = async () => {
    if (!("Notification" in window)) {
      toast.error("Browser does not support notifications.");
      return;
    }

    const result = await Notification.requestPermission();
    if (result !== "granted") {
      toast.error("Notification permission denied");
      setPermission(result);
      return;
    }

    setPermission("granted");

    initPush();
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

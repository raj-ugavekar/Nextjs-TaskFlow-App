"use client";

import { initPush } from "@/lib/features/initPushNotifications";
import { useState } from "react";
import toast from "react-hot-toast";
import { useEffect, useRef } from "react";
import { useUserContext } from "./ContextProvider";

export default function NotificationButton() {
  const [permission, setPermission] = useState("default");

  const { user } = useUserContext();
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

  const hasShownToastRef = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default" &&
      bellRef.current && user?._id && !hasShownToastRef.current) {
      bellRef.current.focus();
      bellRef.current.scrollIntoView({ behavior: "smooth" });
      toast("Click the 🔔 icon to enable task reminders");
      hasShownToastRef.current = true;
    }
  }, [user]);

  return (
    <button
      onClick={handleSubscribe}
      ref={bellRef}
      disabled={permission === "granted"}
      className={` transition ${
        permission === "granted" ? "hidden" : ""
      }`}
    >
      🔔
    </button>
  );
}

"use client";

import { initPush } from "@/lib/features/initPushNotifications";
import { useState } from "react";
import toast from "react-hot-toast";

export default function NotificationButton() {
  const [permission, setPermission] = useState("default");

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

"use client";

import toast from "react-hot-toast";

export async function initPush() {
  if (!("serviceWorker" in navigator)) return;
  if (!("PushManager" in window)) return;

  const permission = Notification.permission;
  if (permission == "granted"){
    try {
      const reg = await navigator.serviceWorker.register("/sw.js");
    
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY)
      });
    
      await fetch("/api/push/save", {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: {
          "Content-Type": "application/json"
        }
      });
      toast.success("Notifications enabled!");
    } catch (err) {
      toast.error("Subscription failed");
      console.error(err);
    }
  }

}

const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
}


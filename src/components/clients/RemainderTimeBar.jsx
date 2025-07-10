"use client";

import { useEffect, useState } from "react";
import { getUrgencyColorClass } from "@/lib/features/clientFeatures";

export default function RemainderTimeBar({ deadline, isCompleted }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    function updateTime() {
      const now = new Date();
      const due = new Date(deadline);
      const diffMs = due - now;

      if (diffMs <= 0) {
        setTimeLeft("Expired");
        return;
      }

      if(isCompleted){
        setTimeLeft("Completed");
        return;
      }

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

      setTimeLeft(`${hours}h : ${minutes}m`);
    }

    updateTime();

    const interval = setInterval(updateTime, 60 * 1000);

    return () => clearInterval(interval);
  }, [deadline,isCompleted]);

  return (
    <div
      className={`h-5 flex items-center text-xs font-medium rounded-b text-center px-4 italic ${
        isCompleted ? "bg-green-900" : getUrgencyColorClass(deadline)
      }`}
    >
      Remaining Time: {timeLeft}
    </div>
  );
}

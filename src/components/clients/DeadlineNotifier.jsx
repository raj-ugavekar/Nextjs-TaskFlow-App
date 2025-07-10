// "use client";

// import { useEffect, useRef } from "react";
// import toast from "react-hot-toast";

// export default function DeadlineNotifier({ tasks, userId }) {
//   const notifiedRef = useRef({});

//   useEffect(() => {
//     const checkDeadlines = () => {
//       const now = new Date();

//       tasks.forEach((task) => {
//         if (task.isCompleted || !task.deadlineAt) return;

//         const deadline = new Date(task.deadlineAt);
//         const diffMins = Math.floor((deadline - now) / 60000);

//         const id = `${task._id}_${diffMins}`;
//         if (notifiedRef.current[id]) return;

//         if ([30, 10, 1].includes(diffMins)) {
//           const timeLabel = diffMins === 1 ? "now" : `in ${diffMins} minutes`;

//           toast(`Task "${task.name}" is due ${timeLabel}`);

//           fetch("/api/push/deadline", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               userId,
//               title: "⏰ Todo Reminder",
//               body: `Todo "${task.name}" is due ${timeLabel}`,
//             }),
//             credentials:"include"
//           });

//           notifiedRef.current[id] = true;
//         }
//       });
//     };

//     const interval = setInterval(checkDeadlines, 60 * 1000);
//     return () => clearInterval(interval);
//   }, [tasks, userId]);

//   return null;
// }

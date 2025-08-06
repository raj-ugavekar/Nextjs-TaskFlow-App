import { connectDB } from "@/lib/features/serverFeatures";
import { User } from "@/lib/models/user";
import webpush from "web-push";
import { NextResponse } from "next/server";
import { Tasks } from "@/lib/models/tasks";
import { TaskBoard } from "@/lib/models/taskBoards";

webpush.setVapidDetails(
  process.env.NEXT_PUBLIC_VAPID_EMAIL,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  process.env.NEXT_PUBLIC_VAPID_PRIVATE_KEY
);

export async function GET() {
  await connectDB();

  const now = new Date();

  const users = await User.find({ pushSubscription: { $exists: true } });

  for (const user of users) {
    const tasks = await Tasks.find({
      createdBy: user._id,
      isCompleted: false,
      deadlineAt: {
        $gte: new Date(now.getTime() - 1000 * 60 * 1),
        $lte: new Date(now.getTime() + 1000 * 60 * 31)
      }
    });

    for (const task of tasks) {
      const deadline = new Date(task.deadlineAt);
      const diffMins = Math.floor((deadline - now) / 60000);

      if ([30, 10, 0].includes(diffMins)) {
        const timeLabel = diffMins === 0 ? "now" : `in ${diffMins} minutes`;

        const taskBoard = await TaskBoard.findOne({_id:task.boardId, userId: task.userId});

        const payload = JSON.stringify({
          title: `⏰ Taskboard ${taskBoard.name} Reminder`,
          body: `Task "${task.title}" is due ${timeLabel}`,
          tag: `task-${todo._id}`,
        });

        try {
          await webpush.sendNotification(user.pushSubscription, payload);
        } catch (err) {
          console.error(`Failed to notify user ${user._id}:`, err?.message);
        }
      }
    }
  }

  return NextResponse.json({ success: true, message: "Reminders sent." , timestamp: now.toISOString()});
} 
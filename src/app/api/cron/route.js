import { connectDB } from "@/lib/features/serverFeatures";
import { User } from "@/lib/models/user";
import webpush from "web-push";
import { NextResponse } from "next/server";
import { Todos } from "@/lib/models/todos";

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
    const todos = await Todos.find({
      userId: user._id,
      isCompleted: false,
      deadlineAt: {
        $gte: new Date(now.getTime() - 1000 * 60 * 1),
        $lte: new Date(now.getTime() + 1000 * 60 * 31)
      }
    });

    for (const todo of todos) {
      const deadline = new Date(todo.deadlineAt);
      const diffMins = Math.floor((deadline - now) / 60000);

      if ([30, 10, 0].includes(diffMins)) {
        const timeLabel = diffMins === 0 ? "now" : `in ${diffMins} minutes`;

        const payload = JSON.stringify({
          title: "⏰ Todo Reminder",
          body: `Todo "${todo.name}" is due ${timeLabel}`,
          tag: `todo-${task._id}`,
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
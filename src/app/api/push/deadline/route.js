
import { checkAuth, connectDB } from "@/lib/features/serverFeatures";
import { User } from "@/lib/models/user";
import webpush from "web-push";

webpush.setVapidDetails(
  "mailto:ugavekarraj@gmail.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  process.env.NEXT_PUBLIC_VAPID_PRIVATE_KEY
);

export async function POST(req) {
  await connectDB();
  const { title, body } = await req.json();

  const userId = await checkAuth();

  const user = await User.findById(userId);
  if (!user?.pushSubscription) return Response.json({ success: false });

  const payload = JSON.stringify({ title, body });
  await webpush.sendNotification(user.pushSubscription, payload);

  return Response.json({ success: true });
}

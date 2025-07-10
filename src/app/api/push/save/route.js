
import { checkAuth, connectDB } from "@/lib/features/serverFeatures";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();
  const user = await checkAuth();
  if (!user) return NextResponse.json({ success: false }, { status: 401 });

  const subscription = await req.json();
  user.pushSubscription = subscription;
  await user.save();

  return NextResponse.json({ success: true });
}

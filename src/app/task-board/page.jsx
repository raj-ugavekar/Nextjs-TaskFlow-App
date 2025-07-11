import Link from "next/link";

export default function TaskBoardPage() {
  return (
    <main className="min-h-screen flex flex-col items-center px-4 bg-[#172842] text-white text-center">
      <div className="flex flex-col items-center space-y-4 mt-20">
        <h1 className="text-2xl font-semibold">Coming Soon</h1>
        <p className="text-base md:text-lg text-white/80 max-w-md">
          The Task Board feature is under development and will be available in a future update.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block px-4 py-2 bg-white text-[#172842] font-semibold rounded hover:bg-white/90 transition"
        >
          Go Back to Home
        </Link>
      </div>
    </main>
  );
}

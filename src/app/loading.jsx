export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#172842] text-white">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white/30"></div>
      <p className="mt-4 text-lg font-medium text-white/80">Loading...</p>
    </div>
  );
}

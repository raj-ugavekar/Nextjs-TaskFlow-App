import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center px-4 bg-[#172842] text-white text-center">

      <div className="flex flex-col justify-center items-center mt-16">
        <img src="logo_icon.svg" className="size-16" alt="" />
        <h1 className="text-3xl md:text-5xl font-bold mb-4">Welcome to TaskFlow</h1>
        <p className="text-base md:text-xl text-white/80 mb-8 max-w-xl">
          Organize your tasks effortlessly. Choose between quick todos or a full Kanban workflow.
        </p>
        <div className="flex flex-col md:flex-row gap-4">
          <Link
            href="/todos"
            className="px-4 sm:px-6 py-3 bg-green-600 hover:bg-green-700 rounded-md font-medium transition transform hover:scale-105"
          >
            Quick Todos
          </Link>
          <Link
            href="/task-board"
            className="px-4 sm:px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-md font-medium transition transform hover:scale-105"
          >
            Task Board (Kanban)
          </Link>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full md:text-left">
        <div className="p-6 bg-white/10 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">⚡ Quick Todos</h3>
          <p className="text-white/80 text-sm leading-relaxed">
            Ideal for daily tasks, reminders, and personal to-dos with automatic notifications.
          </p>
        </div>
        <div className="p-6 bg-white/10 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">🗂️ Kanban Task Board</h3>
          <p className="text-white/80 text-sm leading-relaxed">
            Plan and track larger tasks or projects by dragging tasks across Backlog, In Progress,
            and Completed stages.
          </p>
        </div>
      </div>

      <div className="mt-10 text-white/80 text-sm max-w-md">
        📣 <span className="font-medium">Enable notifications</span> to get task deadline
        reminders right on time!
      </div>

      <footer className="mt-16 py-6 text-xs text-white/40">
        &copy; {new Date().getFullYear()} TaskFlow
      </footer>
    </main>
  );
}

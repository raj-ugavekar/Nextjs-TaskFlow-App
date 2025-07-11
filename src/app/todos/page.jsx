import TodoContainer from "@/components/server/TodoContainer";

export const dynamic = "force-dynamic";

export default async function TodoPage() {
  
  return (
    <div className="bg-[#172842] min-h-screen py-8">
        <div className="w-full max-w-2xl mx-auto shadow-md rounded-lg px-4 py-3 text-white">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-2">Manage Your Todos</h1>
            <p className="text-white/70 text-sm md:text-base italic">
              Add tasks, set deadlines, and stay on track every day.
            </p>
          </div>
          <TodoContainer/>
        </div>
    </div>
  );
}

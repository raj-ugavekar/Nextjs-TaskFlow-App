import { CreateBoardButton } from "@/components/clients/Buttons";
import { HydrateBoards } from "@/components/clients/HydrateData";
import { cookies } from "next/headers";
import Link from "next/link";

export async function getBoards() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const res = await fetch(`${process.env.URL}/api/task-board`, {
      headers: {
        Cookie: `token=${token}`
      },
      cache: "no-store"
    });

    if (!res.ok) return [];

    const data = await res.json();

    if (!data.success) return [];

    return data.taskBoards;
  } catch (error) {
    return [];
  }
}

export default async function BoardListPage() {
  const boards = await getBoards();

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 bg-indigo-600 p-6 rounded-lg text-white shadow">
        <h1 className="text-3xl font-bold">Your Boards</h1>
        <p className="mt-1 text-white/80">Manage, plan, and execute your tasks efficiently.</p>
      </div>
      <HydrateBoards boards={boards}/>
      <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-bold">All Boards</h2>
          {boards.length >0 && <CreateBoardButton/>}
      </div>
      {boards.length === 0 ? (
        <div className="text-center">
          <p className="text-white/70 mb-4">No boards yet.</p>
          <CreateBoardButton/>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {boards.map((board) => (
            <Link
              key={board._id}
              href={`/task-board/${board._id}`}
              className="p-4 bg-white/10 rounded-lg hover:bg-white/20 transition"
            >
              <h3 className="text-xl font-semibold">{board.name}</h3>
              <p className="text-sm text-white/70">Click to open</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

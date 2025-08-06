import BoardColumns from "@/components/server/BoardColumns";
import BoardHeader from "@/components/clients/BoardHeader";
import { AddTaskButton } from "@/components/clients/Buttons";
import { HydrateActiveBoard } from "@/components/clients/HydrateData";
import { cookies } from "next/headers";

async function getBoardDetails(id) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const res = await fetch(`${process.env.URL}/api/task-board/${id}`, {
    headers: { Cookie: `token=${token}` },
    cache: "no-store",
  });

  if (!res.ok) return null;
  const data = await res.json();
  return data.success ? data : null;
}

export default async function BoardContainer({ id }) {
  const boardDetails = await getBoardDetails(id);

  return (
    <>
      <HydrateActiveBoard boardDetails={boardDetails} />
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
        <BoardHeader taskBoard={boardDetails?.taskBoard} />
        <AddTaskButton />
      </div>
      <BoardColumns boardColumns={boardDetails?.boardColumns} tasks={boardDetails?.tasks} />
    </>
  );
}

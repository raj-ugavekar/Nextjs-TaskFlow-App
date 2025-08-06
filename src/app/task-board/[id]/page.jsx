
import BoardContainer from "@/components/server/BoardContainer";
import { Suspense } from "react";

export default async function BoardPage({ params }) {
  const {id} = await params;
  return (
    <div className="text-white min-h-screen">
      <Suspense fallback={<div className="flex items-center justify-center h-[80vh] text-white">Loading Board Details...</div>}>
        <BoardContainer id={id} />
      </Suspense>
    </div>
  );
}
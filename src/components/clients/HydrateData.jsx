"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { hydrateBoards, setActiveBoard } from "@/lib/store/boardSlice";

// Hydrate All Boards
export const HydrateBoards =({ boards })=> {
  const dispatch = useDispatch();

  useEffect(() => {
    if (boards?.length) {
      dispatch(hydrateBoards(boards));
    }
  }, [boards, dispatch]);

  return null;
}

// Hydrate Active Board
export const HydrateActiveBoard =({ boardDetails })=> {
  const dispatch = useDispatch();

  useEffect(() => {
    if (boardDetails) {
      dispatch(setActiveBoard({
          _id: boardDetails.taskBoard._id,
          name: boardDetails.taskBoard.name,
          columns: boardDetails.boardColumns,
          tasks: boardDetails.tasks
        }));
    }
  }, [boardDetails, dispatch]);

  return null;
}

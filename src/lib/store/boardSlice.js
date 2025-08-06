import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  boards: [],
  activeBoard: null,
  columns: [],
  tasks: []
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    hydrateBoards(state, action) {
      state.boards = action.payload;
    },

    addBoard(state, action) {
      state.boards.push(action.payload);
    },

    updateBoard(state, action) {
      const { id, name } = action.payload;
      if (state.activeBoard?._id === id) {
        state.activeBoard.name = name;
      }
      state.boards = state.boards.map((board) =>
        board._id === id ? { ...board, name } : board
      );
    },

    setActiveBoard(state, action) {
      state.activeBoard = action.payload;
    },

    setColumns(state, action) {
      state.columns = action.payload;
    },

    setTasks(state, action) {
      state.tasks = action.payload;
    },

    addColumn(state, action) {
      state.columns.push(action.payload);
    },

    addTask(state, action) {
      state.tasks.push(action.payload);
    }
  }
});

export const {hydrateBoards,addBoard,updateBoard,setActiveBoard,setColumns,setTasks,addColumn,addTask} = boardSlice.actions;

export default boardSlice.reducer;

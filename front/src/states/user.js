import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {},
    users: [],

  },
  reducers: {
    addUser(state, action) {
      state.user = action.payload;
    },

    addUsers(state, action) {
      state.users = action.payload;
    },


    updateUser(state, action) {
      state.users = state.users.map((item) => {
        if (item._id === action.payload._id) return action.payload;
        else return item;
      });
    },

    updateUsers(state, action) {
      state.users.push(action.payload);
    },

    deleteUser(state, action) {
      state.user = {};
      state.users = [];
      state.selected = 0;
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice;

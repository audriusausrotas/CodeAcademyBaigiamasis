import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {},
    users: [],
    // selected: 0,
    // conversations: [],
  },
  reducers: {
    addUser(state, action) {
      state.user = action.payload;
    },

    addUsers(state, action) {
      state.users = action.payload;
    },

    addSelected(state, action) {
      state.selected = action.payload;
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
    /////////////////////////////////////////////////////
    //   addConversations(state, action) {
    //     state.conversations = action.payload;
    //   },

    //   deleteConversation(state, action) {
    //     state.conversations = state.conversations.filter(
    //       (item) => item._id !== action.payload
    //     );
    //     state.selected = 0;
    //   },
    //   //////////////////////////////////////////////////////////

    //   addUserToConversation(state, action) {
    //     state.conversations = state.conversations.map((item) => {
    //       if (item._id === action.payload.index) {
    //         item.users.push(action.payload.user);
    //         return item;
    //       } else {
    //         return item;
    //       }
    //     });
    //   },

    //   //////////////////////////////////////////////////////////

    //   newMessage(state, action) {
    //     const index = state.conversations.findIndex(
    //       (item) => item._id === action.payload._id
    //     );

    //     if (index !== -1) {
    //       state.conversations = state.conversations.map((item) => {
    //         if (item._id === action.payload._id) {
    //           return action.payload;
    //         } else {
    //           return item;
    //         }
    //       });
    //     } else {
    //       state.conversations.push(action.payload);
    //     }
    //   },

    //   likeMessage(state, action) {
    //     state.conversations = state.conversations.map((item) => {
    //       if (item._id === action.payload._id) {
    //         return action.payload;
    //       } else {
    //         return item;
    //       }
    //     });
    //   },
  },
});

export const userActions = userSlice.actions;

export default userSlice;

import { createSlice } from "@reduxjs/toolkit";

const conversationSlice = createSlice({
  name: "user",
  initialState: {
    selected: 0,
    conversations: [],
  },
  reducers: {
    addSelected(state, action) {
      state.selected = action.payload;
    },

    addConversations(state, action) {
      state.conversations = action.payload;
    },

    deleteConversation(state, action) {
      state.conversations = state.conversations.filter(
        (item) => item._id !== action.payload
      );
      state.selected = 0;
    },

    addUserToConversation(state, action) {
      state.conversations = state.conversations.map((item) => {
        if (item._id === action.payload.index) {
          item.users.push(action.payload.user);
          return item;
        } else {
          return item;
        }
      });
    },

    newMessage(state, action) {
      const index = state.conversations.findIndex(
        (item) => item._id === action.payload._id
      );

      if (index !== -1) {
        state.conversations = state.conversations.map((item) => {
          if (item._id === action.payload._id) {
            return action.payload;
          } else {
            return item;
          }
        });
      } else {
        state.conversations.push(action.payload);
      }
    },

    likeMessage(state, action) {
      state.conversations = state.conversations.map((item) => {
        if (item._id === action.payload._id) {
          return action.payload;
        } else {
          return item;
        }
      });
    },
  },
});

export const conversationActions = conversationSlice.actions;

export default conversationSlice;

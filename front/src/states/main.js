import { configureStore } from "@reduxjs/toolkit";
import user from "./user";
import conversation from "./conversations";

const store = configureStore({
  reducer: {
    user: user.reducer,
    conversation: conversation.reducer,
  },
});

export default store;

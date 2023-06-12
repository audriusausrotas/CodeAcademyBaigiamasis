import Home from "./pages/Home";
import Conversations from "./pages/Conversations";
import Navigation from "./components/Layout/Navigation";
import Users from "./pages/Users";
import Profile from "./pages/Profile";
import UserComponent from "./components/users/UserComponent";

import { Route, Routes, BrowserRouter } from "react-router-dom";
import { io } from "socket.io-client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "./states/user";

const socket = io("http://localhost:4000");
let active = [];

export default function App() {
  const dispatch = useDispatch();
  const conversations = useSelector((store) => store.user.conversations);

  useEffect(() => {
    socket.on("newUser", (data) => {
      dispatch(userActions.updateUsers({ ...data }));
    });

    socket.on("allUsers", (data) => {
      dispatch(userActions.addUsers([...data]));
    });

    socket.on("userUpdate", (data) => {
      dispatch(userActions.updateUser({ ...data }));
    });

    socket.on("likeMessage", (data) => {
      dispatch(userActions.likeMessage(data));
    });

    socket.on("newMessage", (data) => {
      dispatch(userActions.newMessage(data.data));
      dispatch(userActions.addUser(data.receiver));
    });

    socket.on("deleteConversation", (data) => {
      dispatch(userActions.deleteConversation(data._id));
      dispatch(userActions.addUser(data.user));
    });

    socket.on("updateInvited", (data) => {
      dispatch(userActions.addUserToConversation(data));
    });
  }, []);
  ////////////////////////////////////////////////////////////////

  useEffect(() => {
    active = [...conversations];
  }, [conversations]);

  return (
    <BrowserRouter>
      <div className="w-screen h-screen bg-gradient-to-tr from-slate-50 via-slate-300 to-slate-400">
        <Navigation />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/conversations" element={<Conversations />} />
          <Route path="/users" element={<Users />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/user/:id" element={<UserComponent />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export function getSocket() {
  return socket;
}

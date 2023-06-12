import http from "./http";
import { useDispatch } from "react-redux";
import { userActions } from "../states/user";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSocket } from "../App";

export function useGetUser(link) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      http.getAuth("autoLogin").then((data) => {
        if (data.success) {
          const user = data.data;
          dispatch(userActions.addUser(user));
          const socket = getSocket();
          socket.emit("userID", user._id);
          navigate("/" + link);
        } else {
          localStorage.removeItem("token");
        }
      });

      /////////////////////////////////////////////// getting messages
      http.getAuth("getMessages").then((data) => {
        if (data.success) {
          dispatch(userActions.addConversations(data.data));
        }
      });
      ///////////////////////////////////////////////// getting all users
      http.getAuth("getUsers").then((data) => {
        if (data.success) {
          dispatch(userActions.addUsers(data.data));
        }
      });
    } else {
      navigate("/");
    }
  }, []);
}

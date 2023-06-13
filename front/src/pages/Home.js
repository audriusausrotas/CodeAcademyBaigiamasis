import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import http from "../plugins/http";
import { useDispatch } from "react-redux";
import { userActions } from "../states/user";
import { useGetUser } from "../plugins/getUsers";
import { getSocket } from "../App";

export default function Home() {
  useGetUser("profile");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, setLogin] = useState(true);
  const [error, setError] = useState("");

  const username = useRef();
  const avatar = useRef();
  const pass1 = useRef();
  const pass2 = useRef();

  const fields = {
    text: login ? "Login" : "Register",
    text2: login ? "Register" : "Login",
    function: login ? loginHandler : registerHandler,
  };

  function loginHandler() {
    http
      .post("login", {
        username: username.current.value,
        pass1: pass1.current.value,
      })
      .then((data) => {
        if (data.success) {
          localStorage.setItem("token", data.message);
          dispatch(userActions.addUser(data.data));
          const socket = getSocket();
          socket.emit("userID", data.data._id);
          navigate("/profile");
          clear();
        } else {
          showError(data.message);
        }
      });
  }

  function registerHandler() {
    http
      .post("register", {
        username: username.current.value,
        pass1: pass1.current.value,
        pass2: pass2.current.value,
        avatar: avatar.current.value,
      })
      .then((data) => {
        if (data.success) {
          setLogin(true);
          clear();
        } else {
          showError(data.message);
        }
      });
  }

  function clear() {
    username.current.value = "";
    pass1.current.value = "";
    !login && (pass2.current.value = "");
    !login && (avatar.current.value = "");
  }

  function showError(err) {
    setError(err);
    setTimeout(() => {
      setError("");
    }, 2000);
  }

  return (
    <div className="flex items-center justify-center p-20">
      <div className="flex flex-col items-center gap-4 p-10 text-xl border rounded-md shadow-lg bg-slate-200">
        <div className="text-3xl font-semibold">{fields.text}</div>
        <input
          type="text"
          placeholder="username"
          className="p-2 bg-white rounded-md shadow-md"
          ref={username}
        />
        {!login && (
          <input
            type="text"
            placeholder="avatar url"
            className="p-2 bg-white rounded-md shadow-md"
            ref={avatar}
          />
        )}

        <input
          type="password"
          placeholder="password"
          className="p-2 bg-white rounded-md shadow-md"
          ref={pass1}
        />
        {!login && (
          <input
            type="password"
            placeholder="retype password"
            className="p-2 bg-white rounded-md shadow-md"
            ref={pass2}
          />
        )}

        <button
          className="w-full p-2 rounded-md shadow-md tezt-lg bg-slate-50 hover:bg-slate-400 hover:text-white"
          onClick={fields.function}
        >
          {fields.text}
        </button>
        <div>
          or{" "}
          <span
            onClick={() => {
              setLogin((prev) => !prev);
            }}
            className="text-blue-500 cursor-pointer"
          >
            {fields.text2}
          </span>{" "}
          here
        </div>
        <div className="text-red-500">{error}</div>
      </div>
    </div>
  );
}

import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../states/user";
import { useRef, useState } from "react";
import http from "../plugins/http";
import ProfileItem from "../components/profile/ProfileItem";
import { useGetUser } from "../plugins/getUsers";

export default function Profile() {
  const user = useSelector((state) => state.user.user);

  const [selected, setSelected] = useState("avatar");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useGetUser("profile");

  const input = useRef();
  const dispatch = useDispatch();

  function changeHandler() {
    if (input.current.value.trim().length === 0) {
      input.current.value = "";
      return;
    }

    http
      .postAuth(`${selected}Change`, {
        newValue: input.current.value,
      })
      .then((data) => {
        if (data.success) {
          dispatch(userActions.addUser(data.data.newUser));
          if (data.data.token) {
            localStorage.setItem("token", data.data.token);
          }
          showSuccess(data.message);
        } else {
          showError(data.message);
        }
        input.current.value = "";
      });
  }

  function showSuccess(msg) {
    setSuccess(msg);
    setTimeout(() => {
      setSuccess("");
    }, 2000);
  }

  function showError(msg) {
    setError(msg);
    setTimeout(() => {
      setError("");
    }, 2000);
  }

  return (
    <div className="flex flex-col items-center justify-center gap-20 pt-20">
      <div className="flex items-center gap-4 p-10 border rounded-md shadow-lg bg-slate-200">
        <img
          src={user.avatar}
          alt=""
          className="object-cover rounded-full h-28 w-28"
        />
        <div className="text-4xl">{user.username}</div>
      </div>
      <div className="flex gap-4 overflow-hidden text-xl rounded-md shadow-lg bg-slate-200">
        <ProfileItem
          name="avatar"
          selected={selected}
          setSelected={setSelected}
        />
        <ProfileItem
          name="username"
          selected={selected}
          setSelected={setSelected}
        />
        <ProfileItem
          name="password"
          selected={selected}
          setSelected={setSelected}
        />
      </div>
      <div className="flex flex-col items-center gap-4">
        <input
          type={selected === "password" ? "password" : "text"}
          placeholder={selected}
          className="w-64 p-2 border rounded-md shadow-lg "
          ref={input}
          onKeyDown={(e) => {
            e.key === "Enter" && changeHandler();
          }}
        />
        <button
          className="w-64 p-2 text-lg rounded-md shadow-lg hover:bg-slate-400 hover:text-white bg-slate-100"
          onClick={changeHandler}
        >
          Save
        </button>
        <div className="text-red-500">{error}</div>
        <div className="text-green-500">{success}</div>
      </div>
    </div>
  );
}

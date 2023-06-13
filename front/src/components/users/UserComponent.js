import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import http from "../../plugins/http";
import { useGetUser } from "../../plugins/getUsers";
import { useDispatch } from "react-redux";
import { conversationActions } from "../../states/conversations";

export default function UserComponent() {
  const [success, setSuccess] = useState("");
  const [usr, setUsr] = useState({});

  const dispatch = useDispatch();
  const message = useRef();
  const params = useParams();

  useGetUser(`user/${params.id}`);

  function sendHandler() {
    if (message.current.value.trim().length < 1 || !usr._id) {
      message.current.value = "";
      return;
    }

    const options = {
      to: [{ _id: usr._id, username: usr.username, avatar: usr.avatar }],
      message: message.current.value,
    };

    http.postAuth("sendMessage", options).then((data) => {
      if (data.success) {
        showSuccess();
        message.current.value = "";
        dispatch(conversationActions.newMessage(data.data));
      }
    });
  }

  function showSuccess() {
    setSuccess("Message sent");
    setTimeout(() => {
      setSuccess("");
    }, 2000);
  }

  useEffect(() => {
    http.postAuth("getUser", { user: params.id }).then((data) => {
      if (data.success) {
        setUsr(data.data);
      }
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-20 p-20">
      <div className="flex items-center gap-4 p-10 border rounded-md shadow-lg bg-slate-200">
        <img
          src={usr.avatar}
          alt=""
          className="object-cover rounded-full h-28 w-28"
        />
        <div className="text-4xl">{usr.username}</div>
      </div>
      <div className="flex flex-col items-center gap-4">
        <textarea
          name="message"
          id=""
          cols="40"
          rows="5"
          className="p-4 border rounded-md shadow-lg outline-none resize-none bg-slate-50"
          ref={message}
          onKeyDown={(e) => {
            e.key === "Enter" && sendHandler();
          }}
        />
        <button
          className="w-full p-2 text-lg rounded-md shadow-lg hover:bg-slate-400 hover:text-white bg-slate-200"
          onClick={sendHandler}
        >
          Send message
        </button>
        <div className="text-green-500">{success}</div>
      </div>
    </div>
  );
}

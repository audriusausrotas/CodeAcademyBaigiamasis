import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import http from "../../plugins/http";

export default function Sidebar({ showSide }) {
  const users = useSelector((store) => store.user.users);
  const selected = useSelector((store) => store.user.selected);
  const conversations = useSelector((store) => store.user.conversations);
  const input = useRef();

  const [filtererUsers, setFilteredUsers] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [error, setError] = useState("");

  function inviteInputHandler() {
    if (showInput) {
      const usr = input.current.value.trim();
      const doesExist = conversations[selected].users.some(
        (item) => item.username === usr
      );
      const invited = users.find((item) => item.username === usr);

      if (!doesExist && invited) inviteHandler(invited);
      else showError();
    }
    setShowInput(!showInput);
    input.current.value = "";
  }

  function inviteHandler(invited) {
    const invitedUser = {
      index: conversations[selected]._id,
      user: {
        _id: invited._id,
        username: invited.username,
        avatar: invited.avatar,
      },
    };

    const options = { cID: invitedUser.index, user: invitedUser.user };
    http.postAuth("inviteUser", options);
  }

  function showError() {
    setError("wrong user");
    setTimeout(() => {
      setError("");
    }, 1000);
  }

  useEffect(() => {
    const existingIds = conversations[selected]?.users.map((item) => item._id);

    const filtered = users?.filter((item) => !existingIds?.includes(item._id));
    setFilteredUsers(filtered);
  }, [showInput, conversations]);

  return (
    conversations.length > 0 && (
      <div className="flex overflow-hidden min-w-fit">
        <div
          style={{
            maxWidth:
              showInput && showSide && filtererUsers.length > 0
                ? "fit-content"
                : "0",
          }}
          className={`sm:flex flex-col hidden text-white transition-all bg-slate-600 `}
        >
          <div className="p-2 text-xl font-semibold text-center ">
            Invite Users
          </div>
          {filtererUsers?.map((item) => (
            <div
              className="flex flex-wrap justify-center gap-2 px-4 py-3 overflow-auto border-b cursor-pointer hover:bg-slate-500"
              key={item._id}
              onClick={() => {
                inviteHandler(item);
              }}
            >
              <img
                src={item.avatar}
                alt=""
                className="object-cover w-8 h-8 border border-orange-500 rounded-full"
              />
              <div>{item.username}</div>
            </div>
          ))}
        </div>

        <div
          className="flex flex-col justify-start text-center transition-all bg-slate-400"
          style={{ width: showSide ? "200px" : "0" }}
        >
          <div className="p-2 text-xl font-semibold text-white cursor-default bg-slate-600">
            Users In Chat
          </div>
          {conversations[selected]?.users?.map((item, index) => (
            <div
              className="flex gap-3 p-2 text-xl border-b cursor-default"
              key={index}
            >
              <img
                src={item.avatar}
                alt=""
                className="object-cover w-8 h-8 border border-orange-500 rounded-full"
              />
              <div>{item.username}</div>
            </div>
          ))}

          <button
            className="p-2 text-xl font-semibold text-white border-b-0 hover:bg-slate-700 bg-slate-600"
            onClick={inviteInputHandler}
          >
            {showInput ? "Invite" : "Add More"}
          </button>

          <input
            ref={input}
            type="text"
            placeholder="username"
            className={`transition-all text-xl font-semibold border-b bg-slate-50 ${
              showInput ? "h-12 p-2" : "h-0 p-0"
            }`}
          />
          <div className="p-2 text-xl text-red-800 capitalize">{error}</div>
        </div>
      </div>
    )
  );
}

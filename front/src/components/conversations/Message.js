import { FaHeartBroken } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import http from "../../plugins/http";
import { useSelector } from "react-redux";

export default function Message({ item }) {
  const user = useSelector((store) => store.user.user);
  const conversations = useSelector(
    (store) => store.conversation.conversations
  );
  const selected = useSelector((store) => store.conversation.selected);

  const self = item.from.username === user.username;
  const showLike = item.likes.includes(user._id);

  function likeHandler() {
    http.postAuth("likeMessage", {
      item,
      cID: conversations[selected]._id,
    });
  }

  return (
    <div className={`flex flex-col w-fit ${self ? "self-end" : "self-start"}`}>
      <div className={`flex gap-2 ${self ? "flex-row-reverse" : "flex-row"}`}>
        <img
          src={item.from.avatar}
          alt=""
          className="object-cover w-8 h-8 border border-orange-500 rounded-full"
        />
        <div
          className={`relative px-3 py-1 rounded-md shadow-md  ${
            self ? "bg-blue-500 text-white" : "bg-slate-50"
          }`}
        >
          {item.message}
          <div
            className={`absolute  -bottom-4 ${
              self ? "-right-3" : "-left-3 hover:cursor-pointer"
            } `}
            onClick={self ? null : likeHandler}
          >
            {item.likes.length < 1 ? (
              <FaHeartBroken size={25} color="#FF9D9D" />
            ) : showLike || self ? (
              <FaHeart size={25} color="#FF3726" />
            ) : (
              <FaHeartBroken size={25} color="#FF9D9D" />
            )}

            {item?.likes.length > 0 && (
              <div
                className={`absolute  text-sm font-bold rounded-full top-[2px] left-2 ${
                  showLike ? "text-white" : ""
                }`}
              >
                {item.likes.length}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={`flex  w-full ${self ? "justify-start" : "justify-end"}`}>
        <div className="text-[12px]">{item.time}</div>
      </div>
    </div>
  );
}

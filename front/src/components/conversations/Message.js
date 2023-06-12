import { FaHeartBroken } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import http from "../../plugins/http";
import { useSelector } from "react-redux";

export default function Message({ item }) {
  const user = useSelector((store) => store.user.user);
  const conversations = useSelector((store) => store.user.conversations);
  const selected = useSelector((store) => store.user.selected);

  function likeHandler() {
    http.postAuth("likeMessage", {
      item,
      cID: conversations[selected]._id,
    });
  }
  const showLike = item.likes.includes(user._id);

  if (item.from.username === user.username) {
    return (
      <div className="flex flex-col items-end self-end w-fit ">
        <div className="flex gap-2">
          <div className="relative px-3 py-1 text-white bg-blue-500 rounded-md shadow-md">
            {item.message}
            <div className="absolute -right-3 -bottom-4">
              {item.likes.length > 0 && <FaHeart size={25} color="#FF3726" />}
              {item?.likes.length > 0 && (
                <div className="absolute text-sm font-bold rounded-full top-[2px] left-2 ">
                  {item.likes.length}
                </div>
              )}
            </div>
          </div>
          <img
            src={item.from.avatar}
            alt=""
            className="object-cover w-8 h-8 border border-orange-500 rounded-full"
          />
        </div>
        <div className="flex justify-start w-full">
          <div className="text-[12px]">{item.time}</div>
        </div>
      </div>
    );
  } else {
    const toShow = item.to.some((usr) => usr._id === user._id);
    if (toShow) {
      return (
        <div className="flex flex-col items-end w-fit ">
          <div className="flex gap-2">
            <img
              src={item.from.avatar}
              alt=""
              className="object-cover w-8 h-8 border border-orange-500 rounded-full"
            />
            <div className="relative px-3 py-1 rounded-md shadow-md bg-slate-50">
              {item.message}
              <div
                className="absolute -left-3 -bottom-4 hover:cursor-pointer"
                onClick={likeHandler}
              >
                {item.likes.length > 0 && showLike ? (
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
          <div className="flex justify-end w-full">
            <div className="text-[12px]">{item.time}</div>
          </div>
        </div>
      );
    }
  }
}

import { useDispatch, useSelector } from "react-redux";
import http from "../../plugins/http";
import { userActions } from "../../states/user";
import { conversationActions } from "../../states/conversations";

export default function ConversationUser({ item, index }) {
  const selected = useSelector((store) => store.conversation.selected);
  const user = useSelector((store) => store.user.user);

  const dispatch = useDispatch();

  function clickHandler() {
    dispatch(conversationActions.addSelected(index));
  }

  function deleteHandler() {
    const obj = {
      cID: item._id,
      users: item.users.filter((item) => item._id !== user._id),
    };
    http.postAuth("deleteConversation", { ...obj }).then((data) => {
      dispatch(userActions.addUser(data.data.user));
      dispatch(conversationActions.deleteConversation(data.data.data._id));
    });
  }

  function getName() {
    if (item.users.length === 2) {
      return item.users[0]._id === user._id
        ? item.users[1].username
        : item.users[0].username;
    } else {
      return (
        <div className="flex flex-wrap gap-2">
          {item.users.map((usr) => (
            <div
              key={usr._id}
              className="relative -ml-5 bg-transparent border-2 border-orange-500 rounded-full first:ml-0 hover:z-10 group"
            >
              <img
                src={usr.avatar}
                alt=""
                className="object-cover object-center w-10 h-10 rounded-full "
              />
              <div className="absolute invisible px-2 pb-2 text-center text-white rounded-md left-6 -bottom-12 group-hover:visible bg-slate-600">
                {usr.username}
              </div>
            </div>
          ))}
        </div>
      );
    }
  }

  function getAvatar() {
    if (item.users.length === 2) {
      return (
        <img
          src={
            item.users[0]._id === user._id
              ? item.users[1].avatar
              : item.users[0].avatar
          }
          alt=""
          className="object-cover object-center w-10 h-10 rounded-full"
        />
      );
    }
  }

  return (
    <div
      className="relative flex flex-wrap items-center justify-between flex-1 p-4 border-b select-none min-w-fit md:flex-none hover:bg-slate-500 hover:cursor-pointer"
      style={{
        backgroundColor:
          selected === index
            ? "#E2E8F0"
            : user?.notifications?.some((x) => x._id === item._id)
            ? "orangered"
            : "",
      }}
      onClick={clickHandler}
    >
      <div className="flex items-center gap-4">
        {getAvatar()}
        <div className="text-2xl">{getName()}</div>
      </div>
      <div
        className="px-3 py-1 text-white bg-red-500 rounded-full hover:cursor-not-allowed"
        onClick={deleteHandler}
      >
        X
      </div>
    </div>
  );
}

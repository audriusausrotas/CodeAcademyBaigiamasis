import { useSelector, useDispatch } from "react-redux";
import { useGetUser } from "../plugins/getUsers";
import http from "../plugins/http";
import { useRef, useState, useEffect } from "react";
import ConversationUser from "../components/conversations/ConversationUser";
import Message from "../components/conversations/Message";
import { userActions } from "../states/user";
import Sidebar from "../components/conversations/Sidebar";
import { BsCaretLeftSquareFill } from "react-icons/bs";
import { BsCaretRightSquareFill } from "react-icons/bs";
import { conversationActions } from "../states/conversations";

export default function Conversations() {
  useGetUser("conversations");

  const conversations = useSelector(
    (store) => store.conversation.conversations
  );
  const selected = useSelector((store) => store.conversation.selected);
  const user = useSelector((store) => store.user.user);

  const [showSide, setShowSide] = useState(false);

  const message = useRef();
  const toBottom = useRef();
  const dispatch = useDispatch();

  function sendMessage() {
    if (message.current.value.trim().length === 0) {
      message.current.value = "";
      return;
    }
    const sendTo = conversations[selected].users.filter(
      (item) => item._id !== user._id
    );

    const options = {
      to: sendTo,
      message: message.current.value,
      cID: conversations[selected]._id,
    };

    http.postAuth("sendMessage", options).then((data) => {
      if (data.success) {
        message.current.value = "";
        dispatch(conversationActions.newMessage(data.data));
      }
    });
  }

  function clearNotification() {
    http
      .postAuth("deleteNotification", { item: conversations[selected]._id })
      .then((data) => {
        if (data.success) {
          message.current.value = "";
          dispatch(userActions.addUser(data.data));
        }
      });
  }

  useEffect(() => {
    const notificationCheck =
      conversations[selected] &&
      user?.notifications?.find((n) => n._id === conversations[selected]._id);

    if (notificationCheck) clearNotification();
  }, [selected, user]);

  return (
    <div className="w-full min-h-[95%] pt-20 ">
      <div className="flex flex-col mx-auto rounded-md shadow-lg md:flex-row md:overflow-hidden max-w-7xl">
        <div className="w-full md:max-w-[300px]  overflow-auto flex-wrap flex md:flex-col min-w-fit bg-slate-400">
          {conversations.length > 0 &&
            conversations.map((item, index) => (
              <ConversationUser item={item} key={index} index={index} />
            ))}
        </div>
        <div className="flex max-h-[600px] h-full  w-full ">
          <div
            className={`flex flex-col bg-slate-200 w-full gap-4 min-h-[600px] p-4 relative transition-all `}
          >
            <div
              className="flex flex-col-reverse h-full overflow-auto"
              ref={toBottom}
            >
              <div className="flex flex-col gap-3">
                {conversations.length > 0 &&
                  conversations[selected]?.messages?.map((item, index) => (
                    <Message item={item} key={index} user={user} />
                  ))}
              </div>
            </div>

            <div className="flex items-center overflow-hidden bg-white rounded-md">
              <input
                type="text"
                placeholder="message"
                className="flex-1 p-2"
                ref={message}
                onKeyDown={(e) => {
                  e.key === "Enter" && sendMessage();
                }}
              />
              <button onClick={sendMessage} className="p-2 hover:bg-slate-300">
                Send
              </button>
            </div>
            {conversations?.length > 0 && (
              <button
                className="absolute top-0 -right-1"
                onClick={() => {
                  setShowSide(!showSide);
                }}
              >
                {showSide ? (
                  <BsCaretRightSquareFill size={44} color="#475569" />
                ) : (
                  <BsCaretLeftSquareFill size={44} color="#94A3B8" />
                )}
              </button>
            )}
          </div>
          <Sidebar showSide={showSide} />
        </div>
      </div>
    </div>
  );
}

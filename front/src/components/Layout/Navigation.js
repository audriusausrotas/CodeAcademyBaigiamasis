import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { userActions } from "../../states/user";
import { useEffect, useState } from "react";
import { MdOutlineNotificationsNone } from "react-icons/md";
import { conversationActions } from "../../states/conversations";

export default function Navigation() {
  const user = useSelector((state) => state.user.user);
  const conversations = useSelector(
    (store) => store.conversation.conversations
  );
  const [selected, setSelected] = useState("");
  const [open, setOpen] = useState(false);
  const [notification, setNotification] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  function logoutHandler() {
    localStorage.removeItem("token");
    dispatch(userActions.deleteUser());
    navigate("/");
  }

  function navigateHandler(e) {
    const temp = conversations.findIndex((item) => item._id === e.target.id);
    dispatch(conversationActions.addSelected(temp));
    navigate("/conversations");
  }

  function menuHandler() {
    setOpen((prev) => !prev);
  }

  useEffect(() => {
    let timeout;
    const updateNotification = () => {
      setNotification(user.notifications.length);
    };
    timeout = setTimeout(updateNotification, 200);
    return () => {
      clearTimeout(timeout);
    };
  }, [user]);

  useEffect(() => {
    setSelected(location.pathname);
  }, [location]);

  return (
    user?.username && (
      <div className="flex flex-wrap justify-center gap-6 p-3 text-2xl shadow-md select-none md:gap-16 h-fit bg-slate-300">
        <Link
          style={{
            color: selected.includes("users") ? "green" : "",
          }}
          to="/users"
        >
          Users
        </Link>
        <Link
          style={{ color: selected.includes("profile") ? "green" : "" }}
          to={"/profile"}
        >
          Profile
        </Link>

        <Link
          style={{ color: selected.includes("conversations") ? "green" : "" }}
          to={`/conversations`}
        >
          Conversations
          <span className="py-1 px-[11px] ml-2 text-white bg-red-500 rounded-full text-[16px] font-semibold ">
            {conversations.length}
          </span>
        </Link>

        <div className="relative hover:cursor-pointer" onClick={menuHandler}>
          <MdOutlineNotificationsNone
            size={36}
            className={`transition-colors duration-0 delay-200	 ${
              user.notifications.length > 0 ? "text-red-500" : "text-black"
            }`}
          />

          <div className="absolute text-sm font-bold top-2 left-[14px] ">
            {notification}
          </div>

          {open && (
            <div className="absolute top-10 right-0 rounded-lg shadow-lg min-w-[350px] z-10 min-h-[64px] flex flex-col gap-2 p-2 bg-slate-500">
              {user.notifications.map((item) => (
                <div
                  className="p-2 rounded-md bg-slate-300 hover:cursor-pointer hover:bg-slate-200"
                  key={item._id}
                  onClick={navigateHandler}
                  id={item._id}
                >
                  message from {item.username}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-4">
          <img
            src={user.avatar}
            alt=""
            className="object-cover object-center w-10 h-10 border border-orange-500 rounded-full"
          />
          <button onClick={logoutHandler}>Logout</button>
        </div>
      </div>
    )
  );
}

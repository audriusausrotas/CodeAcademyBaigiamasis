import { useNavigate } from "react-router-dom";

export default function User({ user }) {
  const navigate = useNavigate();

  function clickHandler() {
    navigate(`/user/${user.username}`);
  }

  return (
    <div className="flex flex-wrap p-8 border rounded-md shadow-lg hover:cursor-pointer bg-slate-200">
      <div className="flex flex-col items-center gap-4" onClick={clickHandler}>
        <img
          src={user.avatar}
          alt=""
          className="object-cover object-center w-40 h-40 rounded-full"
        />
        <div className="text-3xl">{user.username}</div>
      </div>
    </div>
  );
}

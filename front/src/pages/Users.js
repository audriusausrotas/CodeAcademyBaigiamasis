import { useSelector } from "react-redux";
import { useGetUser } from "../plugins/getUsers";
import User from "../components/users/User";

export default function Users() {
  const users = useSelector((state) => state.user.users);
  useGetUser("users");

  return (
    <div className="flex justify-center w-3/4 gap-8 pt-20 m-auto">
      <div className="flex flex-wrap justify-center gap-12">
        {users?.map((item, index) => (
          <User key={index} user={item} />
        ))}
      </div>
    </div>
  );
}

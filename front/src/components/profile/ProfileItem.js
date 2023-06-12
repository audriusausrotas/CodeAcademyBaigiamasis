export default function ProfileItem({ selected, setSelected, name }) {
  return (
    <div
      style={{
        color: selected === name ? "green" : "",
      }}
      className="p-4 hover:cursor-pointer hover:bg-slate-400 hover:text-white"
      onClick={() => {
        setSelected(
          name === "avatar"
            ? "avatar"
            : name === "username"
            ? "username"
            : "password"
        );
      }}
    >
      {"Change " + name}
    </div>
  );
}

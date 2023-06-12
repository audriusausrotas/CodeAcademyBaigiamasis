let DB = [];

module.exports = {
  saveNewUser: (user) => {
    DB.push(user);
  },
  getUsers: () => {
    return DB;
  },
  getUser: (id) => {
    return DB.find((item) => item.userID === id);
  },
  deleteUser: (id) => {
    DB = DB.filter((item) => item.socketID !== id);
  },
};

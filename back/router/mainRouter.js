const express = require("express");
const router = express.Router();
const auth = require("../controllers/auth");
const inputVerification = require("../middleware/inputVerification");
const userCheck = require("../middleware/userCheck");
const updates = require("../controllers/updates");
const updateHelper = require("../middleware/updateHelper");
const messages = require("../controllers/messages");

router.post("/register", inputVerification.checkAll, auth.register);
router.post("/login", inputVerification.checkAll, auth.login);
router.get("/autoLogin", userCheck, auth.autoLogin);
router.post("/getUser", userCheck, auth.getUser);
router.get("/getUsers", userCheck, auth.getUsers);
router.post("/deleteNotification", userCheck, updates.deleteNotification);
router.post("/likeMessage", userCheck, messages.likeMessage);
router.post("/avatarChange", userCheck, updates.updateAvatar);
router.post(
  "/usernameChange",
  userCheck,
  updateHelper.username,
  inputVerification.checkAll,
  updates.updateUsername
);
router.post(
  "/passwordChange",
  userCheck,
  updateHelper.password,
  inputVerification.checkAll,
  updates.updatePassword
);

router.post("/sendMessage", userCheck, messages.sendMessage);
router.get("/getMessages", userCheck, messages.getMessages);
router.post("/deleteConversation", userCheck, messages.deleteConversation);
router.post("/inviteUser", userCheck, messages.inviteUser);

module.exports = router;

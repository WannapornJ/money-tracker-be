const express = require("express");
const router = express.Router();

const controllers = require("../controller/category");
const auth = require("passport").authenticate("jwt", { session: false });

router.get("/", auth, controllers.getUserCategory);
router.post("/", auth, controllers.createUserCategory);
router.patch("/", auth, controllers.updateUserCategory);
module.exports = router;

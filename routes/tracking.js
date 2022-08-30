const express = require("express");
const router = express.Router();

const controllers = require("../controller/tracking");
const auth = require("passport").authenticate("jwt", { session: false });

router.get("/:trackId", auth, controllers.getTransaction);
router.get("/weekly/:week", auth, controllers.getAllTrackingByWeek);
router.get("/daily/:day", auth, controllers.getAllTrackingByDate);
router.get("/monthly/:month", auth, controllers.getAllTrackingByMonth);

router.post("/", auth, controllers.newTransaction);
router.patch("/:trackId", auth, controllers.editTransaction);
router.delete("/:trackId", auth, controllers.deleteTransaction);
module.exports = router;

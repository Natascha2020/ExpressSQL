const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");

router.get("/", adminController.getAllPosts);
router.get("/:id", adminController.getId);
router.put("/:id", adminController.updateUrl);
router.delete("/:id", adminController.deleteId);

module.exports = router;

const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");

// endpoint to get all posts
router.get("/", adminController.getAllPosts);

// endpoint to get specific post by id
router.get("/:id", adminController.getId);

// endpoint to update post by id via route parameter
router.put("/:id", adminController.updateUrl);

// endpoint to delete post by id via route parameter
router.delete("/:id", adminController.deleteId);

module.exports = router;

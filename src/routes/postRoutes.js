const express = require("express");
const router = express.Router();

const postController = require("../controllers/postController");

// endpoint to get all posts, possibility to filter posts via query parameters (continent, limit and rating)
router.get("/", postController.getAllPosts);

// endpoint to create a post and receive updated data as response
router.post("/", (req, res, next) => postController.addPost(req, res, next, true), postController.getAllPosts);

// endpoint to get best 5 rated posts, possibility to filter posts via query parameters (continent)
router.get("/highest-rating", postController.getHighestRating);

// endpoint to get post by id via route parameter
router.get("/:id", postController.getId);

// endpoint to delete post by id via route parameter
router.delete("/:id", postController.deleteId);

// endpoint to update post by id via route parameter
router.put("/:id", (req, res, next) => postController.updateById(req, res, next, true), postController.getAllPosts);

module.exports = router;

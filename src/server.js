require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");

const postController = require("../controllers/postController");

const app = express();

// parsing body-text as url encoded data received from client (test via Postman or similar)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// endpoint to get all posts, possibility to filter posts via query parameters (continent and limit)
app.get("/posts", postController.getAllPosts);

// endpoint to get best 5 rated posts, possibility to filter posts via query parameters (continent)
app.get("/posts/highest-rating", postController.getHighestRating);

// endpoint to create a post and receive updated data as response
app.post("/posts", (req, res, next) => postController.addPost(req, res, next, true), postController.getAllPosts);

// endpoint to get post with specific id via route parameter
app.get("/posts/:id", postController.getId);

// creating server running on port 30003
app.listen(3003, () => console.log("Server is running on port 3003"));

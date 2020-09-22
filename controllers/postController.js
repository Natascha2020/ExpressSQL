const database = require("../src/dbConfig");

const postController = {
  // Getting whole data from table "posts"
  getAllPosts: (req, res) => {
    database
      .query("SELECT * FROM posts;")
      .then((postData) => {
        res.json(postData.rows);
        console.log("testB");
        res.end(postData);
      })
      .catch((error) => {
        console.log(error);
        res.sendStatus(404).send("Post not found");
      });
  },
  getHighestRated: (req, res) => {
    // selecting five highest rated posts, ordered by rating descending
    database
      .query("SELECT * FROM posts ORDER BY rating DESC Limit 5;")
      .then((filteredData) => {
        res.json(filteredData.rows);
        console.log(filteredData.rows);
      })
      .catch((error) => {
        console.log(error);
        res.sendStatus(404).send("Post not found");
      });
  },

  addPost: (req, res, next, goToNext) => {
    const { continent, country, location, imageurl, rating } = req.body;
    // preventing missing entry field
    if (
      !continent ||
      !country ||
      !location ||
      !imageurl ||
      !rating ||
      continent === "" ||
      country === "" ||
      location === "" ||
      imageurl === "" ||
      rating === ""
    ) {
      res.sendStatus(400).send("Please insert valid data");
      return;
    }
    database
      .query(
        `INSERT INTO posts (continent, country, location, imageurl, rating) VALUES ('${continent}','${country}','${location}','${imageurl}', ${rating}) RETURNING *;`
      )
      .then((addedData) => {
        if (goToNext) {
          next();
          res.json(addedData.rows);
          console.log("TestA");
        } else {
          res.json(addedData.rows);
        }
      })
      .catch((error) => {
        console.log(error);
        res.sendStatus(500).send("Internal Server Error");
      });
  },

  filterPosts: (req, res) => {
    // get query strings to filter through continents and give limit of selected posts
    const { limit } = req.query;
    const { continent } = req.query;

    database
      .query(`SELECT * FROM posts ${continent ? "WHERE continent='" + continent + "';" : ""} ${limit ? "LIMIT " + limit + ";" : ""}`)
      .then((filteredData) => {
        res.json(filteredData.rows);
      })
      .catch((error) => {
        console.log(error);
        res.sendStatus(400).send("Please query valid data");
      });
  },
};

module.exports = postController;

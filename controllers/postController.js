const database = require("../src/dbConfig");

// preventing missing entry field (used in addPost-function)
const checkInput = (continent, country, location, imageurl, rating) => {
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
  }
};

const postController = {
  // selecting all posts and sending data to client
  // retrieve query strings from query object on request object to filter through continent and limit and rating(=ASC||=DESC) if requested
  // ensuring request returns filtered posts with lower or uppercase
  // rating=ASC|rating=DESC
  getAllPosts: (req, res) => {
    const { limit } = req.query;
    let { continent } = req.query;
    const { rating } = req.query;

    database
      .query(
        `SELECT * FROM posts ${
          continent
            ? "WHERE continent='" +
              (continent.includes("-")
                ? continent.charAt(0).toUpperCase() + continent.slice(1).replace("-a", "-A")
                : continent.charAt(0).toUpperCase() + continent.slice(1)) +
              "'"
            : ""
        }
        ${rating ? "ORDER BY rating " + rating : ""}
       ${limit ? "LIMIT " + limit : ""}`
      )
      .then((postData) => {
        res.json(postData.rows);
        res.end(postData);
      })
      .catch((error) => {
        console.log(error);
        res.sendStatus(404).send("Post not found");
      });
  },

  getHighestRating: (req, res) => {
    // selecting five highest rated posts, ordered by rating descending
    // retrieve query string from query object on request object to filter through continents if requested
    let { continent } = req.query;
    database
      .query(
        `SELECT * FROM posts ${
          continent
            ? "WHERE continent='" +
              (continent.includes("-")
                ? continent.charAt(0).toUpperCase() + continent.slice(1).replace("-a", "-A")
                : continent.charAt(0).toUpperCase() + continent.slice(1)) +
              "'"
            : ""
        } ORDER BY rating DESC Limit 5;`
      )
      .then((filteredData) => {
        res.json(filteredData.rows);
      })
      .catch((error) => {
        console.log(error);
        res.sendStatus(404).send("Post not found");
      });
  },

  addPost: (req, res, next, goToNext) => {
    const { continent, country, location, imageurl, rating } = req.body;
    // preventing missing entry field
    checkInput(continent, country, location, imageurl, rating);

    database
      .query(
        `INSERT INTO posts (continent, country, location, imageurl, rating) VALUES ('${continent}','${country}','${location}','${imageurl}', ${rating}) RETURNING *;`
      )
      .then((addedData) => {
        if (goToNext) {
          next();
        } else {
          res.json(addedData.rows);
        }
      })
      .catch((error) => {
        console.log(error);
        res.sendStatus(500).send("Internal Server Error");
      });
  },

  getId: (req, res) => {
    // retrieve route parameter (extract id) from params object on request object
    const { id } = req.params;
    database
      .query(`SELECT * FROM posts ${id ? "WHERE id='" + id + "';" : ""}`)
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

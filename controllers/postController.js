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
  // ensuring request with lower or uppercase gets response
  // rating=ASC|rating=DESC
  getAllPosts: (req, res) => {
    const { limit } = req.query;
    let { continent } = req.query;
    const { rating } = req.query;

    const queryString = `SELECT * FROM posts ${
      continent
        ? "WHERE continent='" +
          (continent.includes("-")
            ? continent.charAt(0).toUpperCase() + continent.slice(1).replace("-a", "-A")
            : continent.charAt(0).toUpperCase() + continent.slice(1)) +
          "'"
        : ""
    }
    ${rating ? "ORDER BY rating " + rating : ""}
   ${limit ? "LIMIT " + limit : ""}`;

    database
      .query(queryString)
      .then((postData) => {
        res.json(postData.rows);
        res.end(postData);
      })
      .catch((error) => {
        console.error(error);
        res.sendStatus(404).send("Post not found");
      });
  },

  getHighestRating: (req, res) => {
    // selecting five highest rated posts, ordered by rating descending
    // retrieve query string from query object on request object to filter through continents if requested
    let { continent } = req.query;

    const queryString = `SELECT * FROM posts ${
      continent
        ? "WHERE continent='" +
          (continent.includes("-")
            ? continent.charAt(0).toUpperCase() + continent.slice(1).replace("-a", "-A")
            : continent.charAt(0).toUpperCase() + continent.slice(1)) +
          "'"
        : ""
    } ORDER BY rating DESC Limit 5;`;

    database
      .query(queryString)
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

    const queryString = `INSERT INTO posts (continent, country, location, imageurl, rating) VALUES ('${continent}','${country}','${location}','${imageurl}', ${rating}) RETURNING *;`;
    database
      .query(queryString)
      .then((addedData) => {
        if (goToNext) {
          next();
        } else {
          res.json(addedData.rows);
        }
      })
      .catch((error) => {
        console.error(error);
        res.sendStatus(500).send("Internal Server Error");
      });
  },

  getId: (req, res) => {
    // retrieve route parameter (extract id) from params object on request object
    const { id } = req.params;

    const queryString = `SELECT * FROM posts ${id ? "WHERE id='" + id + "';" : ""}`;
    database
      .query(queryString)
      .then((filteredData) => {
        res.json(filteredData.rows);
      })
      .catch((error) => {
        console.error(error);
        res.sendStatus(400).send("Please query valid data");
      });
  },

  updateId: (req, res) => {
    // retrieve route parameter (extract id) from params object on request object
    const { id } = req.params;
    const { imageurl } = req.body;
    const { rating } = req.body;
    const { continent } = req.body;
    const { location } = req.body;
    const { country } = req.body;
    const queryString = `UPDATE "posts" SET ${imageurl ? "imageurl='" + imageurl + "'" : ""} ${imageurl ? "," : ""} 
    ${continent ? "continent='" + continent + "'" : ""} ${continent ? "," : ""}
    ${country ? "country='" + country + "'" : ""} ${country ? "," : ""}
    ${location ? "location='" + location + "'" : ""} ${location ? "," : ""}
    ${rating ? "rating='" + rating + "'" : ""} WHERE id=${id} RETURNING *`;
    console.log(queryString);
    checkInput(continent, country, location, imageurl, rating);

    database
      .query(queryString)
      .then((queryData) => {
        res.json(queryData.rows);
      })
      .catch((error) => {
        console.error(error);
        res.sendStatus(500);
      });
  },

  deleteId: (req, res) => {
    // retrieve route parameter (extract id) from params object on request object
    const { id } = req.params;
    const queryString = `Delete FROM posts WHERE id=${id}`;
    database
      .query(queryString)
      .then((filteredData) => {
        console.log(filteredData.rows);
        res.sendStatus(200);
      })
      .catch((error) => {
        console.error(error);
        res.sendStatus(400).send("Please query valid data");
      });
  },
};

module.exports = postController;

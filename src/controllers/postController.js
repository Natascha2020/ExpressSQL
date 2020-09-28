const database = require("../dbConfig");
const paramsCheck = require("../helpers/paramsCheck");

const postController = {
  getAllPosts: async (req, res) => {
    // selecting all posts and sending data to client
    // retrieve query strings from query object on request object to filter through continent and limit and rating(=ASC||=DESC) if requested
    // ensuring request with lower or uppercase gets response
    // rating=ASC|rating=DESC
    const { limit, rating } = req.query;
    let { continent } = req.query;
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

    try {
      // destructuring response data.rows
      const { rows } = await database.query(queryString);
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.sendStatus(404);
    }
  },

  getHighestRating: async (req, res) => {
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

    try {
      const { rows } = await database.query(queryString);
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.sendStatus(404);
    }
  },

  addPost: async (req, res, next, goToNext) => {
    const { continent, country, location, imageurl, rating } = req.body;
    // preventing missing entry field in client request
    const validParams = paramsCheck([continent, country, location, imageurl, rating]);
    if (!validParams) {
      res.sendStatus(400).send("Please insert valid data for parameters");
      return;
    }
    const queryString = `INSERT INTO posts (continent, country, location, imageurl, rating) VALUES ('${continent}','${country}','${location}','${imageurl}', ${rating}) RETURNING *;`;

    // goToNext -> getAllPost for returning all posts updated to the client
    try {
      const { rows } = await database.query(queryString);
      if (goToNext) {
        next();
      } else {
        res.json(rows);
      }
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  },

  getId: async (req, res) => {
    // retrieve route parameter (extract id) from params object on request object
    const { id } = req.params;
    const queryString = `SELECT * FROM posts ${id ? "WHERE id='" + id + "';" : ""}`;

    try {
      const { rows } = await database.query(queryString);
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.sendStatus(400).send("Please query valid id");
    }
  },

  updateById: async (req, res, next, goToNext) => {
    // retrieve route parameter (extract id) from params object on request object
    const { id } = req.params;
    const { imageurl, rating, continent, location, country } = req.body;

    const queryString = `UPDATE "posts" SET ${imageurl ? "imageurl='" + imageurl + "'" : ""} ${imageurl ? "," : ""} 
    ${continent ? "continent='" + continent + "'" : ""} ${continent ? "," : ""}
    ${country ? "country='" + country + "'" : ""} ${country ? "," : ""}
    ${location ? "location='" + location + "'" : ""} ${location ? "," : ""}
    ${rating ? "rating='" + rating + "'" : ""} WHERE id=${id} RETURNING *`;

    // preventing missing entry field in client request
    const validParams = paramsCheck([continent, country, location, imageurl, rating]);
    if (!validParams) {
      res.sendStatus(400).send("Please insert valid data for parameters");
      return;
    }

    // goToNext -> getAllPost for returning all posts updated to the client
    try {
      const { rows } = database.query(queryString);
      if (goToNext) {
        next();
      } else {
        res.json(rows);
      }
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  },

  deleteId: async (req, res) => {
    // retrieve route parameter (extract id) from params object on request object
    const { id } = req.params;
    const queryString = `Delete FROM posts WHERE id=${id}`;

    try {
      const { rows } = database.query(queryString);
      console.log(rows);
      res.sendStatus(200);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  },
};

module.exports = postController;

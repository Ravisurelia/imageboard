const express = require("express");
const app = express();

app.use(express.static(__dirname + "/public"));

const { gettingImages } = require("./db");

app.get("/gettingImages", (req, res) => {
  gettingImages()
    .then((results) => {
      console.log("this is my getting results", results);
      res.json(results.rows); //this is how you send the respond back to vue
    })
    .catch((err) => {
      console.log("this is my catch err: ", err);
    });

  //res.json(results.rows); //this is how you send the respond back to vue
});

app.listen(8080, () => {
  console.log("my express server running!!!!");
});

/* let cities = [
    {
      name: "berlin",
      country: "DE",
    },
    {
      name: "mumbai",
      country: "IND",
    },
    {
      name: "london",
      country: "UK",
    },
  ]; */

const express = require("express");
const app = express();

const { gettingImages } = require("./db");

//-----------------------------------------------------
//-------FILE UPLOAD BOILERPLATE-----------------------
//-----------------------------------------------------
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const diskStorage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, __dirname + "/uploads");
  },
  filename: function (req, file, callback) {
    uidSafe(24).then(function (uid) {
      callback(null, uid + path.extname(file.originalname));
    });
  },
});

const uploader = multer({
  storage: diskStorage,
  limits: {
    fileSize: 2097152,
  },
});
//-----------------------------------------------------
//-------FILE UPLOAD BOILERPLATE-----------------------
//-----------------------------------------------------

app.use(express.static(__dirname + "/public"));

app.post("/upload", uploader.single("file"), (req, res) => {
  console.log("file: ", req.file); //file we just uploaded
  console.log("input: ", req.body); //rest of the input field username, title, description
  if (req.file) {
    //you will do db insert here all the info
    res.json({
      success: true,
    });
  } else {
    res.json({
      success: false,
    });
  }
});

app.get("/gettingImages", (req, res) => {
  gettingImages()
    .then((results) => {
      //console.log("this is my getting results", results);
      //always check the result then see what you want to return from results
      //then return it with res.json to axios to give the data back
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

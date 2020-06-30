const express = require("express");
const app = express();
const s3 = require("./s3");
const { s3Url } = require("./config.json");

const {
  gettingImages,
  uploadImage,
  gettingModal,
  addingComments,
  gettingComments,
} = require("./db");

app.use(express.json());

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

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
  console.log("file: ", req.file); //file we just uploaded
  console.log("input: ", req.body); //rest of the input field username, title, description
  const { filename } = req.file;
  const imageUrl = `${s3Url}${filename}`;

  if (req.file) {
    //you will do db insert here all the info
    uploadImage(
      imageUrl,
      req.body.username,
      req.body.title,
      req.body.description
    )
      .then(({ rows }) => {
        res.json(rows[0]);
      })
      .catch((err) => {
        console.log("This is my uploadImage err: ", err);
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

//part3---------------
app.get("/images/:id", (req, res) => {
  gettingModal(req.params.id)
    .then((results) => {
      console.log("my req.params.id: ", req.params.id);

      res.json(results.rows[0]);
    })
    .catch((err) => {
      console.log("this is my catch err in get image id: ", err);
    });
});

//part3---------------
app.get("/comments/:id", (req, res) => {
  gettingComments(req.params.id)
    .then((results) => {
      console.log("my req.params.id: ", req.params.id);
      res.json(results.rows);
    })
    .catch((err) => {
      console.log("this is my catch err in get comment id: ", err);
    });
});

//part3---------------
app.post("/comments", (req, res) => {
  console.log("this is my re.body in post index", req.body);

  addingComments(req.body.imageId, req.body.username, req.body.comment)
    .then(({ rows }) => {
      console.log(req.params.imageId);

      res.json(rows[0]);
    })
    .catch((err) => {
      console.log("This is my adding comments err: ", err);
    });
});

app.listen(8080, () => {
  console.log("my express server running!!!!");
});

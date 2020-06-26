const spicedPg = require("spiced-pg");

let db;
if (process.env.DATABASE_URL) {
  db = spicedPg(process.env.DATABASE_URL);
} else {
  const { dbUser, dbPass } = require("./secrets.json");
  //console.log(dbUser, dbPass);
  db = spicedPg(`postgres:${dbUser}:${dbPass}@localhost:5432/pixelr`);
}

exports.gettingImages = () => {
  //inserting user data first, last, email, password
  return db.query(`SELECT * FROM images`);
};

exports.uploadImage = (url, username, title, description) => {
  //inserting data
  return db.query(
    `INSERT INTO images (url, username, title, description) VALUES ($1, $2, $3, $4) RETURNING *`,
    [url, username, title, description]
  );
};

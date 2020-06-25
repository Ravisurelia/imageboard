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

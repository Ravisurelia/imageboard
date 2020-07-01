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
  return db.query(`SELECT * FROM images ORDER BY created_at DESC LIMIT 8`);
};

exports.uploadImage = (url, username, title, description) => {
  //inserting data
  return db.query(
    `INSERT INTO images (url, username, title, description) VALUES ($1, $2, $3, $4) RETURNING *`,
    [url, username, title, description]
  );
};

exports.gettingModal = (id) => {
  return db.query(`SELECT * FROM images WHERE id = $1`, [id]);
};

exports.addingComments = (imageId, username, comment) => {
  return db.query(
    `INSERT INTO comments (image_id, username, comment) VALUES ($1, $2, $3) RETURNING *`,
    [imageId, username, comment]
  );
};

exports.gettingComments = (id) => {
  return db.query(
    `SELECT * FROM comments WHERE image_id = $1 ORDER BY created_at DESC`,
    [id]
  );
};

exports.getMoreImages = (lastId) => {
  return db
    .query(
      `SELECT *, (SELECT MIN(id) 
    FROM images) 
    AS last_id
    FROM images
    WHERE id < $1
    ORDER BY id DESC
    LIMIT 8`,
      [lastId]
    )
    .then(({ rows }) => rows);
};

const spicedPg = require("spiced-pg");
const db = spicedPg("postgres:postgres:postgres@localhost:5432/imageboard");

module.exports.getImagesDataBaseInformation = () => {
    const q = `SELECT url, username, title, description FROM images`;
    return db.query(q);
};

module.exports.addImageUploadToAWS = (url, username, title, description) => {
    const q = ` INSERT INTO images (url, username, title, description)
                VALUES ($1, $2, $3, $4) 
                RETURNING url, username, title, description`;
    const params = [url, username, title, description];
    return db.query(q, params);
};

// RETURNING -- on the insert

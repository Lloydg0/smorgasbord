const spicedPg = require("spiced-pg");
const db = spicedPg("postgres:postgres:postgres@localhost:5432/imageboard");

module.exports.getImagesDataBaseInformation = () => {
    const q = `SELECT url, username, title, description FROM images`;
    return db.query(q);
};

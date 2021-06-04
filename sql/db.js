const spicedPg = require("spiced-pg");
const db = spicedPg("postgres:postgres:postgres@localhost:5432/imageboard");

//DATABASE select information about images to display on main page (3 at a time)
module.exports.getImagesDataBaseInformation = () => {
    const q = ` SELECT id, url, username, title, description FROM images
                ORDER BY id DESC
                LIMIT 3;`;
    return db.query(q);
};

// DATABASE select to retrieve older images step by step
module.exports.retrievingNextRowOfImages = (lowestId) => {
    const q = ` SELECT url, username, title, description, id, (
                SELECT id FROM images
                ORDER BY id ASC
                LIMIT 1
                ) AS "lowestId" FROM images
                WHERE id < $1
                ORDER BY id DESC
                LIMIT 3;`;

    return db.query(q, [lowestId]);
};

//DATABASE select all information about images referencing an image ID for clicked image
module.exports.getImagesDataBaseInformationForModel = (imageId) => {
    const q = `SELECT * FROM images WHERE ID = $1 `;
    return db.query(q, [imageId]);
};

//DATABASE insert for uploading the images to AWS
module.exports.addImageUploadToAWS = (url, username, title, description) => {
    const q = ` INSERT INTO images (url, username, title, description)
                VALUES ($1, $2, $3, $4) 
                RETURNING url, username, title, description`;
    const params = [url, username, title, description];
    return db.query(q, params);
};

//DATABASE insert for posting comments
module.exports.postingComments = (image_id, comment_text, username) => {
    const q = ` INSERT INTO comments (image_id, comment_text, username)
                VALUES ($1, $2, $3)
                RETURNING image_id, comment_text, username`;
    const params = [image_id, comment_text, username];
    return db.query(q, params);
};
//DATABASE select for getting the comments for a selected image
module.exports.retrieveImageComments = (imageId) => {
    const q = ` SELECT images.id, comments.id, comments.comment_text, comments.username, comments.created_at 
                FROM images
                LEFT JOIN comments 
                ON images.id = comments.image_id
                WHERE image_id = $1`;
    return db.query(q, [imageId]);
};

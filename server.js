const express = require("express");
const app = express();
const db = require("./sql/db.js");
app.use(express.static("public"));

app.get("/imageboard", (req, res) => {
    db.getImagesDataBaseInformation()
        .then((result) => {
            console.log("DATA BASE INFO", result.rows);
            res.json(result.rows);
        })
        .catch((err) => {
            console.log("ERROR in retrieving Information from Database", err);
        });
});

app.listen(8080, () => console.log("Image board listening on 8080!!"));

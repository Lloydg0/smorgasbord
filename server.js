const express = require("express");
const app = express();
const db = require("./sql/db.js");
const s3 = require("./s3");
let s3url = require("./config.json");
//the following ocde is required to uoload files
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
////// end of code that uploads the files

//getting static folders
app.use(express.static("public"));

// url encoded parser
app.use(
    express.urlencoded({
        extended: false,
    })
);

app.use(express.json());
//

//get request to get images from DB
app.get("/imageboard", (req, res) => {
    db.getImagesDataBaseInformation()
        .then((result) => {
            res.json(result.rows);
        })
        .catch((err) => {
            console.log(err);
        });
});
//Get request got more images (pagination)
app.get("/imageboard/:lowestId", (req, res) => {
    const { lowestId } = req.params;
    db.retrievingNextRowOfImages(lowestId)
        .then((result) => {
            res.json({
                success: true,
                payload: result.rows,
            });
        })
        .catch((err) => {
            console.log(err);
        });
});
//GET request for a specific image for the single model PopUp
app.get("/imagemodel/:imageId", (req, res) => {
    const { imageId } = req.params;
    db.getImagesDataBaseInformationForModel(imageId)
        .then((result) => {
            res.json(result.rows);
        })
        .catch((err) => {
            console.log(err);
        });
});

//GET request for comments on a specific image on the Model PopUp
app.get("/comments/:imageId", (req, res) => {
    const { imageId } = req.params;
    db.retrieveImageComments(imageId)
        .then((result) => {
            res.json({
                success: true,
                payload: result.rows,
            });
        })
        .catch((err) => {
            console.log(err);
        });
});

//POST request for adding comments
app.post("/comments", (req, res) => {
    const { imageId, comment, username } = req.body;
    db.postingComments(imageId, comment, username)
        .then((result) => {
            res.json({
                success: true,
                payload: result.rows,
            });
        })
        .catch((err) => {
            console.log(err);
        });
});

//POST request to uploads the images
app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    if (req.file) {
        let s3Url = s3url.s3Url;
        const prefixedFilename = s3Url.concat(req.file.filename);
        db.addImageUploadToAWS(
            prefixedFilename,
            req.body.username,
            req.body.title,
            req.body.description
        )
            .then((result) => {
                res.json({
                    success: true,
                    payload: result.rows,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    } else {
        res.json({
            success: false,
        });
    }
});

app.listen(8080, () => console.log("Image board listening on 8080!!"));

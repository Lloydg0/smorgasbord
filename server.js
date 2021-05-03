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
        fileSize: 2097152, //files over 2mb cannot be uploaded used to stop ddos attacks (if upload does not work, check the size of the file as it might be too big and not a bug in the code).
    },
});
////// end of code that uploads the files

//getting static folders
app.use(express.static("public"));

//get request to get images from DB
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

//get image data for the single model
app.get("/imagemodel/:imageId", (req, res) => {
    const { imageId } = req.params;
    db.getImagesDataBaseInformationForModel(imageId)
        .then((result) => {
            console.log("DATA BASE INFO for Model", result.rows);
            res.json(result.rows);
        })
        .catch((err) => {
            console.log(
                "ERROR in retrieving Information from Database for the single image model",
                err
            );
        });
});

//POST request to uploads the images
app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    console.log("upload Worked!!!!");
    //insert into DB  (filename, title, description, username)
    console.log("req.body", req.body);
    console.log("req.file", req.file); // req.file comes fom multer
    if (req.file) {
        // this will run if everything works
        let s3Url = s3url.s3Url;
        const prefixedFilename = s3Url.concat(req.file.filename);
        console.log("Prefixed Filename", prefixedFilename);
        //instert into images
        db.addImageUploadToAWS(
            prefixedFilename,
            req.body.username,
            req.body.title,
            req.body.description
        )
            .then((result) => {
                console.log("Result in addimageUpload to AWS", result);
                // send back a response using res.json
                res.json({
                    success: true,
                    payload: result.rows,
                });
            })
            .catch((err) => {
                console.log("Error in adding the img to AWS", err);
            });
    } else {
        //this runs if something broke
        // send back a response to vue using res.json
        // the response we send back needs to be something that indicates the upload didnt work
        res.json({
            success: false,
        });
    }
});

app.listen(8080, () => console.log("Image board listening on 8080!!"));

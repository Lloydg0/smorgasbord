// Vue component for uploading content
Vue.component("upload-component", {
    //template
    template: "#upload-template",
    //data
    data: function () {
        return {
            title: "",
            description: "",
            username: "",
            file: null,
        };
    },
    //mounted
    mounted: function () {
        // the componetns mounted doesnt run until the component is rendered
        console.log("Show Upload has mounted!");
    },
    methods: {
        handleChange: function (e) {
            this.file = e.target.files[0];
        },
        submitFile: function (e) {
            // e.preventDefault();
            console.log("e in submitFile is running");
            //were going to user an API called FormData to send the file to the server (formData is only for files)
            var formData = new FormData();
            formData.append("file", this.file);
            //makes sense to have other data in one big object with the file
            formData.append("title", this.title);
            formData.append("description", this.description);
            formData.append("username", this.username);
            //formData always logd and empty object, that mean it didnt work
            // console.log("formdata", formData);

            /// next step is to send formdata off to the server (all communcaiton with client and server happens with axios in vue)

            //what ever you add as the second arguement in axios.post is going to end up in server.js in req.body
            //second argument must be an object
            axios
                .post("/upload", formData)
                .then((response) => {
                    console.log("response recieved from server", response);
                    console.log("response data", response.data.payload[0]);
                    this.$emit("imagepush", response.data.payload[0]);
                })
                .catch((err) => {
                    console.log("err in POST/upload", err);
                });
        },
        closeModel: function () {
            // console.log("Finsihed being clicked");
            this.$emit("close");
        },
    },
});
//Vue component for rendering a single image model
Vue.component("image-model-component", {
    template: "#image-model-template",
    props: ["imageId"],
    data: function () {
        return {
            image: [],
            date: "",
        };
    },
    mounted: function () {
        // console.log("Image has mounted to the model");
        let retrieveImageId = this.imageId;
        // console.log("Retrieve IMAGE ID", retrieveImageId);
        //make get request to the server
        axios
            .get("/imagemodel/" + retrieveImageId)
            .then((response) => {
                // console.log("Response.data in model", response.data);
                this.image = response.data[0];
                let date = new Date(response.data[0].created_at);
                let formattedDate = new Intl.DateTimeFormat("en-GB", {
                    dateStyle: "long",
                    timeStyle: "short",
                }).format(date);
                this.date = formattedDate;
            })
            .catch((err) => {
                console.log(
                    "ERROR in axios.get in retrieving the dynamic image ID model",
                    err
                );
            });
    },
    methods: {
        closeModelOnPopUp: function () {
            console.log("Showing Image has closed model");
            this.$emit("close");
        },
    },
});
//Vue component for rendering the comments
Vue.component("comments-component", {
    template: "#comments-template",
    props: ["imageId"],
    data: function () {
        return {
            comments: [],
            username: "",
            comment: "",
        };
    },
    mounted: function () {
        console.log("Comments have mounted to the model");
        console.log(
            "Axios.get in the comments component checking the imageID in the props",
            this.imageId
        );
        axios
            .get("/comments/" + this.imageId)
            .then((response) => {
                console.log(
                    "response in comments for data",
                    response.data.payload
                );
                this.comments = response.data.payload;
            })
            .catch((err) => {
                console.log(
                    "ERROR in axios.get for retrieving the comments for a specific image",
                    err
                );
            });
    },
    methods: {
        submitComment: function () {
            let comment = this.comment;
            let username = this.username;
            console.log("imageId", this.imageId);
            axios
                .post("/comments", {
                    imageId: this.imageId,
                    comment,
                    username,
                })
                .then((response) => {
                    console.log(
                        "axios response for posting comments",
                        response.data
                    );
                })
                .catch((err) => {
                    console.log("err in POST/comment axios", err);
                });
        },
        // showComments: function () {
        //     this.comments = true;
        // },
    },
});
//main Vue Instance
new Vue({
    el: "#main",
    data: {
        showUpload: false,
        imageId: null,
        images: [],
        lowestIdOnScreen: false,
    },
    mounted: function () {
        console.log("this in mounted", this);
        axios.get("/imageboard").then((response) => {
            this.images = response.data;
            console.log("images", this.images);
        });
    },
    methods: {
        pushingImages: function (data) {
            this.images.push(data);
        },
        showUploadModel: function () {
            // console.log("Showing upload component is running");
            this.showUpload = true;
        },
        closeUploadModel: function () {
            // console.log("Closing the model is running!");
            this.showUpload = false;
        },
        showImageModel: function (imageId) {
            // console.log("Showing image model work", imageId);
            this.imageId = imageId;
        },
        closeImageModel: function () {
            // console.log("Showing image model close");
            this.imageId = null;
        },
        clickToAddMoreImages: function () {
            console.log("CLick to add more images");
            console.log(
                "Lowest IMG ID",
                this.images[this.images.length - 1].id
            );
            let lowestId = this.images[this.images.length - 1].id;
            axios.get("/imageboard/" + lowestId).then((response) => {
                for (let i = 0; i < response.data.payload.length; i++) {
                    this.images.push(response.data.payload[i]);
                }

                if (lowestId !== 2) {
                    //subject to change when completed
                    this.lowestIdOnScreen = false;
                } else {
                    this.lowestIdOnScreen = true;
                }
            });
        },
    },
});

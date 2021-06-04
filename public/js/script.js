Vue.component("upload-component", {
    template: "#upload-template",
    data: function () {
        return {
            title: "",
            description: "",
            username: "",
            file: null,
            isUploadAnimationClosed: false,
            isUploadAnimationVisable: false,
        };
    },
    mounted: function () {},
    methods: {
        handleChange: function (e) {
            this.file = e.target.files[0];
        },
        submitFile: function (e) {
            var formData = new FormData();
            formData.append("file", this.file);

            formData.append("title", this.title);
            formData.append("description", this.description);
            formData.append("username", this.username);
            axios
                .post("/upload", formData)
                .then((response) => {
                    this.$emit("imagepush", response.data.payload[0]);
                })
                .catch((err) => {
                    console.log(err);
                });
        },

        toggleUploadAnimationOff: function () {
            if (this.isUploadAnimationClosed === false) {
                this.isUploadAnimationClosed = true;
            }
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
            isImageModelScaledDown: false,
            isOpacityBackFull: false,
        };
    },
    mounted: function () {
        let retrieveImageId = this.imageId;

        axios
            .get("/imagemodel/" + retrieveImageId)
            .then((response) => {
                this.image = response.data[0];
                let date = new Date(response.data[0].created_at);
                let formattedDate = new Intl.DateTimeFormat("en-GB", {
                    dateStyle: "long",
                    timeStyle: "short",
                }).format(date);
                this.date = formattedDate;
            })
            .catch((err) => {
                console.log(err);
            });
    },
    watch: {
        imageId: function () {
            let retrieveImageId = this.imageId;
            axios
                .get("/imagemodel/" + retrieveImageId)
                .then((response) => {
                    this.image = response.data[0];
                    let date = new Date(response.data[0].created_at);
                    let formattedDate = new Intl.DateTimeFormat("en-GB", {
                        dateStyle: "long",
                        timeStyle: "short",
                    }).format(date);
                    this.date = formattedDate;
                })
                .catch((err) => {
                    console.log(err);
                });
        },
    },
    methods: {
        toggleOffSelectedImageModel: function () {
            if (
                this.isImageModelScaledDown === false &&
                this.isOpacityBackFull === false
            ) {
                this.isImageModelScaledDown = true;
                this.isOpacityBackFull = true;
                setTimeout(() => {
                    this.$emit("close");
                }, 501);
            }
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
        axios
            .get("/comments/" + this.imageId)
            .then((response) => {
                this.comments = response.data.payload;
            })
            .catch((err) => {
                console.log(err);
            });
    },
    watch: {
        imageId: function () {
            axios
                .get("/comments/" + this.imageId)
                .then((response) => {
                    this.comments = response.data.payload;
                })
                .catch((err) => {
                    console.log(err);
                });
        },
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
                    this.comments.push(response.data.payload[0]);
                })
                .catch((err) => {
                    console.log(err);
                });
        },
    },
});
//main Vue Instance
new Vue({
    el: "#main",
    data: {
        imageId: location.hash.slice(1),
        images: [],
        lowestIdOnScreen: false,
        isUploadAnimationVisable: false,
    },
    mounted: function () {
        axios.get("/imageboard").then((response) => {
            this.images = response.data;
        });

        window.addEventListener("hashchange", () => {
            this.imageId = location.hash.slice(1);
        });
    },
    methods: {
        pushingImages: function (data) {
            this.images.unshift(data);
        },
        toggleUploadAnimationOn: function () {
            if (this.isUploadAnimationVisable === false) {
                this.isUploadAnimationVisable = true;
            } else {
                this.isUploadAnimationVisable = false;
            }
        },
        closeImageModel: function () {
            this.imageId = null;
            location.hash = "";
            history.pushState({}, "", "/");
        },
        clickToAddMoreImages: function () {
            let lowestId = this.images[this.images.length - 1].id;
            axios.get("/imageboard/" + lowestId).then((response) => {
                for (let i = 0; i < response.data.payload.length; i++) {
                    this.images.push(response.data.payload[i]);
                }

                if (lowestId > 1) {
                    this.lowestIdOnScreen = false;
                } else {
                    this.lowestIdOnScreen = true;
                }
            });
        },
    },
});

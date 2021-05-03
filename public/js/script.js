//vue.component will turn "my-component" into a html tag
Vue.component("upload-component", {
    //config for component
    //what template should be attached
    template: "#upload-template",
    //data, mounted, methods
    data: function () {
        return {
            title: "",
            description: "",
            username: "",
            file: null,
        };
    },
    mounted: function () {
        // the componetns mounted doesnt run until the component is rendered
        console.log("Show Upload has mounted!");
        //axios.get
    },
    methods: {
        handleChange: function (e) {
            // console.log(" e in handle Change is running", e.target.files[0]);
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
        console.log("Image has mounted to the model");
        let retrieveImageId = this.imageId;
        console.log("Retrieve IMAGE ID", retrieveImageId);
        //make get request to the server
        axios.get("/imagemodel/" + retrieveImageId).then((response) => {
            console.log("Response.data in model", response.data);
            this.image = response.data[0];
            let date = new Date(response.data[0].created_at);
            let formattedDate = new Intl.DateTimeFormat("en-GB", {
                dateStyle: "long",
                timeStyle: "short",
            }).format(date);
            this.date = formattedDate;
        });
    },
    methods: {
        closeModelOnPopUp: function () {
            console.log("Showing Image has closed model");
            this.$emit("close");
        },
    },
});

new Vue({
    el: "#main",
    data: {
        showUpload: false,
        imageId: null,
        images: [],
    },
    mounted: function () {
        console.log("this in mounted", this);
        axios.get("/imageboard").then((response) => {
            // console.log("Response in axios", response);
            // console.log("Response in axios", response.data);
            this.images = response.data;
            // console.log("this in axios", this);
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
            console.log("Showing image model work", imageId);
            this.imageId = imageId;
        },
        closeImageModel: function () {
            console.log("Showing image model close");
            this.imageId = null;
        },
    },
});

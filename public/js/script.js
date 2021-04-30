console.log("Hello");

// const cards = document.getElementsByClassName(fullCard);

new Vue({
    el: "#main",
    data: {
        images: [],
        title: "",
        description: "",
        username: "",
        file: null,
    },
    mounted: function () {
        // var scroll = this;
        // window.addEventListener("scroll", function () {
        //     scroll.windowTop = window.scrollY;
        //     console.log("THAT", scroll.windowTop);
        // });
        console.log("this in mounted", this);
        axios.get("/imageboard").then((response) => {
            // console.log("Response in axios", response);
            // console.log("Response in axios", response.data);
            this.images = response.data;
            // console.log("this in axios", this);
        });
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
                .then(() => {
                    console.log("response recievedf from server");
                })
                .catch((err) => {
                    console.log("err in POST/upload", err);
                });
        },
    },
});

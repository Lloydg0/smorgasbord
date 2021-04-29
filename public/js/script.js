console.log("Hello");

// const cards = document.getElementsByClassName(fullCard);

new Vue({
    el: "#main",
    data: {
        images: [],
    },
    mounted: function () {
        // var scroll = this;
        // window.addEventListener("scroll", function () {
        //     scroll.windowTop = window.scrollY;
        //     console.log("THAT", scroll.windowTop);
        // });
        console.log("this in mounted", this);
        axios.get("/imageboard").then((response) => {
            console.log("Response in axios", response);
            console.log("Response in axios", response.data);
            this.images = response.data;
            console.log("this in axios", this);
        });
    },
    method: {
        // fadeOut: function () {},
    },
});

console.log("Hello");

// const cards = document.getElementsByClassName(fullCard);

new Vue({
    el: "#main",
    data: {
        images: [],
    },
    mounted: function () {
        var scroll = this;
        window.addEventListener("scroll", function () {
            scroll.windowTop = window.scrollY;

            // document
            //     .getElementsByClassName(fullCard)
            //     .css("opacity", 1 - window.scrollTop() / 1);

            console.log("THAT", scroll.windowTop);
        });
        console.log("this in mounted", this);
        axios.get("/imageboard").then((response) => {
            console.log("Response in axios", response.data.rows);
            this.images = response.data.rows;
            console.log("this in axios", this);
        });
    },
    method: {
        // fadeOut: function (e) {},
    },
});

(function () {
  new Vue({
    el: "#main",
    data: {
      //whatever you add in data will add as property of "this".
      name: "dill",
      //values are reactive...vue automatically changes and make updates
      seen: true,
      gettingAllInfo: [],
    },

    mounted: function () {
      console.log("this is my this: ", this);
      var self = this;
      axios.get("/gettingImages").then(function (response) {
        console.log("this is my axios returning cities: ", response);
        self.gettingAllInfo = response.data;
      });
    },

    methods: {
      myFunction: function () {
        console.log("my function is running!!");
      },
    },
  });
})();

(function () {
  new Vue({
    el: "#main",
    data: {
      //whatever you add in data will add as property of "this".
      name: "dill",
      //values are reactive...vue automatically changes and make updates

      //adding values to input field and adding it to index.html with v-mode
      seen: true,
      gettingAllInfo: [],
      title: "",
      description: "",
      username: "",
      file: null,
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
      handleClick: function (e) {
        e.preventDefault(); //this doesn't let the page to reload
        console.log("my function with this:", this);
        //we are using formdata just because we are working with the files

        var formData = new FormData();
        //appending on the data
        formData.append("title", this.title);
        formData.append("description", this.description);
        formData.append("username", this.username);
        formData.append("file", this.file);

        axios
          .post("/upload", formData)
          .then(function (resp) {
            console.log("resp from POST/upload: ", resp);
          })
          .catch(function (err) {
            console.log("my post upload error: ", err);
          });
      },

      handleChange: function (e) {
        console.log("my function handlechange:");
        console.log("file: ", e.target.files[0]);
        //we are targeting the file and .files means the files and [0] means the selected files
        this.file = e.target.files[0];
        console.log("this is after adding the file: ", this);
      },
    },
  });
})();

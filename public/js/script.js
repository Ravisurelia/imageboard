(function () {
  ///////this is a child component to vue instance
  Vue.component("first-component", {
    //this is what connect our html to our vue component
    //this must be equal to the id of our script tag in html
    template: "#template", //here shows where the code is coming from thats why we are passing the id from html
    props: ["id"],
    data: function () {
      return {
        url: "",
        title: "",
        description: "",
        username: "",
        comments: [],
        user_name: "",
        user_comment: "",
        created_at: "",
      };
    },

    mounted: function () {
      const self = this;
      console.log("this is my props: ", this.id);
      axios
        .get(`/images/${this.id}`)
        .then(function (response) {
          console.log("This is my response in get child mount: ", response);
          self.url = response.data.url;
          self.title = response.data.title;
          self.description = response.data.description;
          self.username = response.data.username;
          self.created_at = response.data.created_at;
          console.log("here it issssssss", self);
        })
        .catch(function (err) {
          console.log("error");
        });

      //getting comment thing done here
      axios
        .get(`/comments/${this.id}`)
        .then(function (response) {
          console.log("comment get axios req: ", response);
          self.comments = response.data;
        })
        .catch(function (err) {
          console.log("error in comment axios");
        });
    },

    methods: {
      closeMe: function () {
        console.log("emitting from the component.");
        this.$emit("close");
      },

      postComments: function (e) {
        e.preventDefault();
        console.log("my function with this in child postcomment:", this);
        const self = this;

        axios
          .post("/comments", {
            imageId: self.id,
            username: self.user_name,
            comment: self.user_comment,
          })
          .then(function (resp) {
            console.log("resp from POST/upload: ", resp);
            self.comments.unshift(resp.data);
            self.user_comment = "";
            self.user_name = "";
          })
          .catch(function (err) {
            console.log("my post upload error in child : ", err);
          });
      },
    },
  });

  /*   vue  is the parent here---------------------------------------*/
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
      id: null,
      //here we are checking the if statement which we used in first component in html
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
        var self = this;
        axios
          .post("/upload", formData)
          .then(function (resp) {
            console.log("resp from POST/upload: ", resp);
            self.gettingAllInfo.unshift(resp.data);
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

      close: function () {
        console.log("This is closing things from parent side ");
        //here we want to update the data to close the modal or make image id to null so modal closes at the end
      },

      modalOpen: function (id) {
        console.log("getting my this.id: ", this.id);
        this.id = id;
      }, //part3

      closeAll: function () {
        this.id = null;
      },
    },
  });
})();

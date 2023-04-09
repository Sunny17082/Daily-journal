const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Write your daily journal here. To start click on compose new.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://0.0.0.0:27017/blogDB")
.then( () => console.log("Connection successful....."))
.catch( (err) => console.log(err));

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){
  const getDocument = async() =>{
    const posts = await Post.find({});
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
    });
  };
  getDocument();
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.get("/posts/:postId", function(req, res){
  const requestedPostId = req.params.postId;
  const getDocument = async() => {
    const foundPost = await Post.findOne({_id: requestedPostId});
    if (foundPost) {
      res.render("post", {
        title: foundPost.title,
        content: foundPost.content
      });
    }
  }
  getDocument();
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save();
  res.redirect("/");
});

app.post("/",function(req, res){
  res.redirect("/compose");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
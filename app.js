//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://<USERNAME>:<PASSWORD>@cluster0-dvn5y.mongodb.net/" + "<DATABASENAME>" + "?retryWrites=true/" , { useNewUrlParser: true });

// Create timestamps
const timestamps = {timestamps: { createdAt: "created_at", updatedAt: "updated_at" }};

// Create parent schema below child schemas
const blogPost = new mongoose.Schema({title: {type: String, max:60, required: [1, "A title is required"]}, body: {type: String, max:500, required: [1, "A body is required"]}}, timestamps);

// Create a new model
const Post = mongoose.model("Post", blogPost);

const aboutContent = "Bringing insight within our development career as it relates to the current industries we work in";
const contactContent = "recodeveloper.com / recomatrix117@gmail.com";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public/"));
const view = __dirname + "/views/pages";


//------------------------- RESTful APIs -----------------------------------
app.route("/apis")
  .get(function(req, res){
    // find one by provided id
    Post.find({}, function (err, posts) {
      if (err) {
        res.send(err);
      } else {
        res.send(posts);
      }
    });
  });

app.route("/api/post/:id")
  .get(function(req, res){
    // find one by provided id
    Post.findById(req.params.id, function(err, post){
      if (err) {
        res.send(err);
      } else {
        if(_.lowerCase(req.params.id) === _.lowerCase(post.id)){
          res.send(post);
        }
      }
    });
  });

//------------------ Pages ----------------------------------
app.get("/", function(req, res){
  // Read all from database
  Post.find({}, function (err, posts) {
    if (err) {
      console.log(err);
    } else {
      res.render(view + "/home", { posts: posts});
    }
  });
});

app.get("/api", function(req, res){
  // Read all from database
  Post.find({}, function (err, posts) {
    if (err) {
      console.log(err);
    } else {
      res.render(view + "/api", { posts: posts});
    }
  });
});

app.get("/about", function(req, res){
  res.render(view + "/about", { about: aboutContent});
});

app.get("/contact", function(req, res){
  res.render(view + "/contact", { contact: contactContent});
});

app.get("/compose", function(req, res){
  res.render(view + "/compose");
});

app.get("/post/:id/:title", function(req, res){
  // find one by provided id
  Post.findById(req.params.id, function(err, post){
    if (err) {
      console.log(err);
    } else {
      if(_.lowerCase(req.params.id) === _.lowerCase(post.id)){
        res.render(view + "/post", {title: post.title, body: post.body, created: post.updated_at});
      }
    }
  });
});

app.post("/compose", function(req, res){
  // Create, save parent and redirect
  const post = new Post({
    title: _.capitalize(req.body.title),
    body: _.capitalize(req.body.body)
  });
  post.save(function(err){
    if(err){
      res.redirect("/");
    } else {
      res.redirect("/");
    }
  });
});

//---------------------- Server -----------------------------
app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});

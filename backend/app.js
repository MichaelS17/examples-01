const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const Post = require('./models/post');

const app = express();





mongoose
  .connect('mongodb+srv://Mingu:9AqUAYRGBKkmyUTs@cluster0-wddxq.mongodb.net/node-angular?retryWrites=true&w=majority', { useNewUrlParser: true } )
    .then(() => {
      console.log('Connected to db');
    })
    .catch(() => {
      console.log('Failed Connect');
      console.log(error);
    });


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  next();
});

app.post('/api/posts', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(createdPost => {
    es.status(201).json({
      message: "POST ADDED SUCCESS",
      postId: createdPost._id
    });
  });
});

app.get('/api/posts', (req, res, next) => {
  Post.find().then(documents => {
    res.status(200).json({
      message: "posts fecthed success",
      posts: documents
    });
  });
});

app.delete('/api/posts/:id', (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: "post deleted" });
  });
});

module.exports = app;



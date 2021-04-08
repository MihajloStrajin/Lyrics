const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const songsRoutes = require("./routes/songs");
const userRoutes = require("./routes/user");
const favoriteSongsRoutes = require("./routes/favoriteSongs");

const app = express();

mongoose.connect("mongodb://localhost:27017/Lyrics",
{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
.then(() => {
  console.log('Connected to database!');
})
.catch(() => {
  console.log('Connection failed');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req,res,next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requsted-Width, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
  next();
});

app.use("/api/songs", songsRoutes);
app.use("/api/user", userRoutes);
app.use("/api/favoriteSongs", favoriteSongsRoutes);

module.exports = app;

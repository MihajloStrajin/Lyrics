const express = require("express");
const Song = require('../models/song');

const router = express.Router();
const checkAuth = require("../middleware/check-auth");

router.post("", checkAuth,(req,res,next) => {
  const song = new Song({
    title: req.body.title,
    content: req.body.content,
    url: req.body.url,
    creator: req.userData.userId
  });
  song.save().then(createdSong => {
    res.status(201).json({
      message: 'Song added successfully',
      songId: createdSong._id
    });
  })
  .catch(error => {
    res.status(500).json({
      message: "Neuspesno kreiranje"
    });
  });
});

router.put("/:id",checkAuth, (req,res,next) => {
  const song = new Song({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    url: req.body.url
  });
  Song.updateOne({_id: req.params.id}, song)
    .then(result => {
      if(result.nModified > 0){
        res.status(200).json({message: 'Update successful'});
      }else{
        res.status(401).json({message: 'Not authorized'});
      }
  })
  .catch(error => {
    res.status(500).json({
      message: "Neuspesan update!"
    });
  });
});

router.get('',(req,res,next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const songQuery = Song.find();
  let fetchedSongs;
  if(pageSize && currentPage){
    songQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  songQuery.then(documents => {
    fetchedSongs = documents;
      return Song.countDocuments();
    })
    .then(count => {
      res.status(200).json({
        message: 'Songs fetched successfully!',
        songs: fetchedSongs,
        maxSongs: count
    });
  })
    .catch(error => {
      res.status(500).json({
        message: "Fetching posts failed!"
      });
    });
});

router.get("/:id", (req,res,next) => {
  Song.findById(req.params.id).then(song => {
    if(song) {
      res.status(200).json(song);
    }
    else{
      res.status(404).json({message: "Song not found!"});
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "Fetching post failed!"
    });
  });
});

router.delete("/:id",checkAuth, (req,res,next) => {
  Song.deleteOne({_id: req.params.id}).then(result => {
    if(result.n > 0){
      res.status(200).json({message: 'Deleted successful'});
    }else{
      res.status(401).json({message: 'Not authorized'});
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "Fetching posts failed!"
    });
  });
});

module.exports = router;

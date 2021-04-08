const express = require("express");
const Song = require('../models/song');
const User = require('../models/user');
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

router.post("", checkAuth,(req,res,next) => {
  User.updateOne(
    { _id: req.userData.userId },
    { $addToSet: { favorites: req.body.id } }
)
  .catch(error => {
    res.status(500).json({
      message: "Neuspesno kreiranje"
    });
  });
});

router.get('',checkAuth,(req,res,next) => {
  User.findById(req.userData.userId).populate("favorites").then(documents => {//creator:req.userData.userId
    fetchedSongs = documents;
      return User.countDocuments();
    })
    .then(count => {

      res.status(200).json({
        message: 'Songs fetched successfully!',
        songs: fetchedSongs.favorites
    });
  })
    .catch(error => {
      res.status(500).json({
        message: "Fetching posts failed!"
      });
    });
});

router.delete("/:id",checkAuth, (req,res,next) => {
  User.updateOne(
    { _id: req.userData.userId },
    { $pull: { favorites: req.params.id} }
).then(result => {
  if(result.n > 0){
    res.status(200).json({message: 'Deleted successful'});
  }else{
    res.status(401).json({message: 'Not authorized'});
  }
})
  .catch(error => {
    res.status(500).json({
      message: "Delete favorite song failed!"
    });
  });
});

module.exports = router;

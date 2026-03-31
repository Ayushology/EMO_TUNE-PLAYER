const express = require("express");
const multer = require("multer");
const router = express.Router();
const songModel = require("../models/songs.model");
const uploadFile = require("../service/storage.service");

const upload = multer({ storage: multer.memoryStorage() });

router.post("/songs", upload.single("audio"), async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.file);

    const fileUrl = await uploadFile(req.file);
    console.log(fileUrl);

    const song = await songModel.create({
      title: req.body.title,
      artist: req.body.artist,
      mood: req.body.mood,
      url: fileUrl,
    });

    res.status(201).json({
      message: "Song created successfully",
      song: song,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Upload failed",
      error: error.message,
    });
  }
});

router.get("/songs", async (req, res) => {
  try {
    const { mood } = req.query;

    if (!mood) {
      return res.status(400).json({ message: "Mood is required" });
    }

    const songs = await songModel.find({ mood: mood });

    res.status(200).json({ songs });
  }
   catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;

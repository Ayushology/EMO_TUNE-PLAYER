import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import Songs from "./Songs";
import "./facialexpression.css";
import axios from 'axios';

const FacialExpression = () => {
  const videoRef = useRef();
  const [expression, setExpression] = useState("Awaiting face...");
  const [isDetecting, setIsDetecting] = useState(false);
  
  // NEW: State to hold the fetched songs
  const [suggestedSongs, setSuggestedSongs] = useState([]);

  const loadModels = async () => {
    const MODEL_URL = "/models";
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
  };

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => console.error("Camera error:", err));
  };

  const detectMood = async () => {
    if (!videoRef.current) return;
    setIsDetecting(true);

    try {
      const detections = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (detections?.expressions) {
        const expressions = detections.expressions;

        const maxExpression = Object.keys(expressions).reduce((a, b) =>
          expressions[a] > expressions[b] ? a : b
        );

        const mood = maxExpression;
        setExpression(mood);

        console.log("Final Mood:", mood);
// Fetch songs based on mood
const response = await axios.get(
  `https://emo-tune-player-1.onrender.com/songs?mood=${mood}`
);
        // NEW: Update the state with the data from your backend
        setSuggestedSongs(response.data.songs); 

      } else {
        setExpression("Not detected");
        setSuggestedSongs([]); // Clear songs if no face is detected
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDetecting(false);
    }
  };

  useEffect(() => {
    loadModels().then(startVideo);
  }, []);

  return (
    <div className="moody-wrapper">
      <div className="container">
        <header className="app-header">
          <h1 className="app-title">EmoTune</h1>
          <br /><br />
          <p className="app-subtitle">Know your current state of mind.</p>
        </header>

        <section className="analysis-panel">
          <div className="video-container">
            <div className="status-badge">
              <span className="pulse-dot"></span> LIVE
            </div>
            <video ref={videoRef} autoPlay muted playsInline className="camera-feed" />
            <div className="video-overlay"></div>
          </div>

          <div className="controls-container">
            <h2 className="section-heading">Biometric Sync</h2>

            <div className="action-row">
              <button
                className="btn-analyze"
                onClick={detectMood}
                disabled={isDetecting}
              >
                {isDetecting ? "Scanning..." : "Initialize Sync"}
              </button>

              <div className="result-display">
                <span className="result-label">Detected Emotion:</span>
                <span className="result-value">{expression}</span>
              </div>
            </div>
          </div>
        </section>

        {/* NEW: Pass the dynamic songs array as a prop */}
        <Songs
          currentMood={
            expression === "Awaiting face..." || expression === "Not detected"
              ? ""
              : expression
          }
          songs={suggestedSongs} 
        />
      </div>
    </div>
  );
};

export default FacialExpression;  
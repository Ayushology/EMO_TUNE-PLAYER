import React, { useState, useRef } from "react";
import "./Moodsongs.css";

const Songs = ({ currentMood, songs }) => {
  const [playingTrack, setPlayingTrack] = useState(null);
  
  // NEW: State for tracking song time and duration
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const audioRef = useRef(null);

  const togglePlay = (url) => {
    if (playingTrack === url) {
      audioRef.current.pause();
      setPlayingTrack(null);
    } else {
      setPlayingTrack(url);
      // Reset times when a new song starts
      setCurrentTime(0); 
      setDuration(0);
      
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play();
        }
      }, 0);
    }
  };

  // NEW: Update state as the song plays
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // NEW: Set the total duration once the audio file loads
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // NEW: Handle user dragging the seek bar
  const handleSeek = (e) => {
    const newTime = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
    setCurrentTime(newTime);
  };

  // NEW: Helper function to format seconds into M:SS
  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <section className="playlist-section">
      {/* Updated Audio Element with new event listeners */}
      <audio 
        ref={audioRef} 
        src={playingTrack || ""} 
        onEnded={() => setPlayingTrack(null)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />

      <div className="playlist-header">
        <h3 className="playlist-title">Playlist</h3>
        {currentMood && (
          <span className="mood-tag">Curated for: {currentMood}</span>
        )}
      </div>

      <div className="track-list">
        {songs && songs.length > 0 ? (
          songs.map((song, index) => (
            <div className="track-wrapper" key={index}>
              <div className={`track-item ${playingTrack === song.url ? 'active-track' : ''}`}>
                <div className="track-index">
                  {(index + 1).toString().padStart(2, "0")}
                </div>

                <div className="track-meta">
                  <h4 className="track-name">{song.title}</h4>
                  <span className="track-artist">{song.artist}</span>
                </div>

                <div className="track-duration">
                  {/* Show current time if playing, otherwise show total duration if we have it */}
                  {playingTrack === song.url ? formatTime(currentTime) : "--:--"}
                </div>

                <button
                  className="btn-play"
                  onClick={() => togglePlay(song.url)}
                >
                  {playingTrack === song.url ? "⏸" : "▶"}
                </button>
              </div>

              {/* NEW: The Seek Controller - Only shows for the currently playing song */}
              {playingTrack === song.url && (
                <div className="seek-controller">
                  <span className="time-text">{formatTime(currentTime)}</span>
                  <input
                    type="range"
                    className="seek-slider"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                  />
                  <span className="time-text">{formatTime(duration)}</span>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-tracks-message">
            {currentMood 
              ? "No songs found for this mood." 
              : "Scan your face to get personalized song recommendations!"}
          </div>
        )}
      </div>
    </section>
  );
};

export default Songs;
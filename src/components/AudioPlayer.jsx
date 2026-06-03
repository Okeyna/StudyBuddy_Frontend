// src/components/AudioPlayer.jsx
import { useAudio } from '../contexts/AudioContext';
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaTimes, FaHeadphones } from 'react-icons/fa';
import { syncProgress } from '../services/api';

export const AudioPlayer = () => {
  const { currentTrack, isPlaying, togglePlayPause, progress, duration, seek } = useAudio();

  const handleSeek = (e) => {
    const newTime = (e.target.value / 100) * duration;
    seek(newTime);
    if (currentTrack?.audioId) syncProgress(currentTrack.audioId, Math.floor(newTime));
  };

  if (!currentTrack) {
    return (
      <div className="fixed bottom-6 right-6 bg-white/90 backdrop-blur-md rounded-full shadow-lg p-3">
        <FaHeadphones className="text-gray-400 text-2xl" />
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-2xl transform transition-transform duration-300">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center space-x-4">
          {/* Track Info */}
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{currentTrack.title}</p>
            <p className="text-xs text-gray-400">Now Playing</p>
          </div>
          
          {/* Progress Bar */}
          <div className="flex-1">
            <input
              type="range"
              min="0"
              max="100"
              value={duration ? (progress / duration) * 100 : 0}
              onChange={handleSeek}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex items-center space-x-3">
            <button
              onClick={togglePlayPause}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-110"
            >
              {isPlaying ? <FaPause size={16} /> : <FaPlay size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' + secs : secs}`;
};
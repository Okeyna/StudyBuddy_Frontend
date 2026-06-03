// src/pages/AudioDetail.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAudio } from '../contexts/AudioContext';
import { getAudioStream, syncProgress, getTranscript } from '../services/api';
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaSpinner } from 'react-icons/fa';

export const AudioDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { playTrack, togglePlayPause, isPlaying, currentTrack, seek, progress, duration } = useAudio();
  
  const [audioData, setAudioData] = useState(null);
  const [transcript, setTranscript] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [bookmarks, setBookmarks] = useState([]);
  const [currentBookmark, setCurrentBookmark] = useState('');

  // Fetch audio details and transcript
  useEffect(() => {
    const fetchAudioDetails = async () => {
      try {
        setLoading(true);
        const [audioRes, transcriptRes] = await Promise.all([
          getAudioStream(id),
          getTranscript(id)
        ]);
        
        setAudioData(audioRes.data);
        setTranscript(transcriptRes.data);
        
        // Auto-play when loaded
        if (!currentTrack || currentTrack.audioId !== id) {
          playTrack(audioRes.data.url, audioRes.data.title, id);
        }
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load audio');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAudioDetails();
  }, [id, playTrack, currentTrack]);

  // Sync progress periodically
  useEffect(() => {
    if (!id || !progress) return;
    
    const syncInterval = setInterval(async () => {
      if (progress > 0) {
        await syncProgress(id, Math.floor(progress));
      }
    }, 5000); // Sync every 5 seconds
    
    return () => clearInterval(syncInterval);
  }, [id, progress]);

  const handleSeek = (e) => {
    const newTime = (e.target.value / 100) * duration;
    seek(newTime);
    syncProgress(id, Math.floor(newTime));
  };

  const handlePlaybackRate = (rate) => {
    setPlaybackRate(rate);
    if (window.audioElement) {
      window.audioElement.playbackRate = rate;
    }
  };

  const addBookmark = async () => {
    if (!currentBookmark.trim()) return;
    
    const newBookmark = {
      id: Date.now(),
      timestamp: Math.floor(progress),
      label: currentBookmark,
      timeFormatted: formatTime(progress)
    };
    
    setBookmarks([...bookmarks, newBookmark]);
    setCurrentBookmark('');
    
    // Save bookmark to backend (optional)
    // await saveBookmark(id, newBookmark);
  };

  const jumpToTimestamp = (timestamp) => {
    seek(timestamp);
    syncProgress(id, timestamp);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-2 bg-red-500 text-white px-3 py-1 rounded"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Audio Info Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2">{audioData?.title}</h1>
        <p className="text-gray-600">{audioData?.description}</p>
        <p className="text-sm text-gray-500 mt-2">Duration: {formatTime(duration)}</p>
      </div>

      {/* Playback Controls */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={togglePlayPause}
            className="bg-blue-500 text-white p-4 rounded-full hover:bg-blue-600"
          >
            {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} />}
          </button>
          
          <div className="flex-1 mx-4">
            <input
              type="range"
              min="0"
              max="100"
              value={duration ? (progress / duration) * 100 : 0}
              onChange={handleSeek}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
          
          <div className="flex space-x-2">
            {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((rate) => (
              <button
                key={rate}
                onClick={() => handlePlaybackRate(rate)}
                className={`px-2 py-1 rounded text-sm ${
                  playbackRate === rate
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bookmarks Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Bookmarks</h2>
        <div className="flex mb-4">
          <input
            type="text"
            value={currentBookmark}
            onChange={(e) => setCurrentBookmark(e.target.value)}
            placeholder="Add a bookmark at current position..."
            className="flex-1 p-2 border rounded-l"
          />
          <button
            onClick={addBookmark}
            className="bg-green-500 text-white px-4 rounded-r hover:bg-green-600"
          >
            Add
          </button>
        </div>
        <div className="space-y-2">
          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer"
              onClick={() => jumpToTimestamp(bookmark.timestamp)}
            >
              <div>
                <span className="font-mono text-sm text-blue-600">{bookmark.timeFormatted}</span>
                <span className="ml-2">{bookmark.label}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setBookmarks(bookmarks.filter(b => b.id !== bookmark.id));
                }}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          ))}
          {bookmarks.length === 0 && (
            <p className="text-gray-500 text-center py-4">No bookmarks yet</p>
          )}
        </div>
      </div>

      {/* Transcript Section */}
      {transcript && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Transcript</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {transcript.segments?.map((segment, idx) => (
              <div
                key={idx}
                className={`p-2 rounded cursor-pointer hover:bg-gray-50 ${
                  Math.floor(progress) >= segment.start_time && 
                  Math.floor(progress) <= segment.end_time
                    ? 'bg-blue-50 border-l-4 border-blue-500'
                    : ''
                }`}
                onClick={() => jumpToTimestamp(segment.start_time)}
              >
                <span className="font-mono text-xs text-gray-500">
                  {formatTime(segment.start_time)}
                </span>
                <p className="mt-1">{segment.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00';
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
import { useAudio } from '../contexts/AudioContext';
import { FaPlay, FaPause, FaStepBackward, FaStepForward } from 'react-icons/fa';
import { syncProgress } from '../services/api';

export const AudioPlayer = () => {
  const { currentTrack, isPlaying, togglePlayPause, progress, duration, seek } = useAudio();

  const handleSeek = (e) => {
    const newTime = (e.target.value / 100) * duration;
    seek(newTime);
    if (currentTrack?.audioId) syncProgress(currentTrack.audioId, Math.floor(newTime));
  };

  if (!currentTrack) return <div className="p-4 text-center text-gray-500">No audio playing</div>;

  return (
    <div className="bg-white shadow-md rounded-lg p-4 fixed bottom-0 left-0 right-0">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="font-medium truncate">{currentTrack.title}</p>
          <input
            type="range"
            min="0"
            max="100"
            value={duration ? (progress / duration) * 100 : 0}
            onChange={handleSeek}
            className="w-full mt-2"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        <button onClick={togglePlayPause} className="ml-4 p-3 bg-blue-500 rounded-full text-white">
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
      </div>
    </div>
  );
};

const formatTime = (seconds) => {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' + secs : secs}`;
};
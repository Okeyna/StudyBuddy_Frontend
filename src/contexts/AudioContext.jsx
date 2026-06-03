import { createContext, useContext, useRef, useState } from 'react';

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const audioRef = useRef(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const playTrack = (url, title) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    const audio = new Audio(url);
    audioRef.current = audio;
    setCurrentTrack({ url, title });
    audio.play();
    setIsPlaying(true);
    audio.ontimeupdate = () => setProgress(audio.currentTime);
    audio.onended = () => setIsPlaying(false);
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const seek = (seconds) => {
    if (audioRef.current) audioRef.current.currentTime = seconds;
  };

  return (
    <AudioContext.Provider value={{ playTrack, togglePlayPause, isPlaying, currentTrack, progress, seek }}>
      {children}
    </AudioContext.Provider>
  );
};
export const useAudio = () => useContext(AudioContext);
import { createContext, useContext, useEffect, useRef, useState } from 'react';

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const audioRef = useRef(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const playTrack = (url, title, audioId = null) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const audio = new Audio(url);
    audioRef.current = audio;

    // Set up audio event listeners
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });

    audio.addEventListener('timeupdate', () => {
      setProgress(audio.currentTime);
    });

    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setProgress(0);
    });

    audio.addEventListener('ratechange', () => {
      setPlaybackRate(audio.playbackRate);
    });

    setCurrentTrack({ url, title, audioId });
    audio.play().catch((error) => {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
    });
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((error) => {
        console.error('Error playing audio:', error);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const seek = (seconds) => {
    if (audioRef.current && !isNaN(seconds)) {
      audioRef.current.currentTime = Math.max(0, Math.min(seconds, duration));
      setProgress(audioRef.current.currentTime);
    }
  };

  const changePlaybackRate = (rate) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsPlaying(false);
      setProgress(0);
      setDuration(0);
      setCurrentTrack(null);
    }
  };

  return (
    <AudioContext.Provider
      value={{
        playTrack,
        togglePlayPause,
        isPlaying,
        currentTrack,
        progress,
        duration,
        seek,
        playbackRate,
        changePlaybackRate,
        stop,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
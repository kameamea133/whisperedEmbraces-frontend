import { useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Pause, Music} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { togglePlayPause, setPlaying } from '../slices/musicSlice';

const BackgroundMusic = () => {
  const audioRef = useRef(null);
  const isPlaying = useSelector(state => state.music.isPlaying);
  const dispatch = useDispatch();

  // Initialiser l'audio seulement quand nécessaire
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/bgMusic.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = 1;
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(err => {
        console.log('Error playing audio:', err);
        dispatch(setPlaying(false));
      });
    } else {
      audio.pause();
    }

    return () => {
      if (audio) {
        audio.pause();
      }
    };
  }, [isPlaying, dispatch]);

  const togglePlayPauseHandler = useCallback(() => {
    dispatch(togglePlayPause());
  }, [dispatch]);

  return (
    <div className="fixed bottom-4 right-8 z-50">
      <motion.button
        onClick={togglePlayPauseHandler}
        className="p-4 rounded-full bg-gradient-to-r from-blue-400 to-teal-500 text-white shadow-lg focus:outline-none hover:bg-opacity-90"
        aria-label={isPlaying ? "Pause la musique de fond" : "Joue la musique de fond"}
        whileHover={{ scale: 1.2 }}
        animate={{
          scale: [1, 1.1, 1],
          rotate: isPlaying ? [0, 5, -5, 0] : 0,
          transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
        }}
      >
        <motion.div
          animate={{
            scale: isPlaying ? 1.1 : 1,
            transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          {isPlaying ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Music className="w-6 h-6" />
          )}
        </motion.div>
      </motion.button>
    </div>
  );
};

export default BackgroundMusic;

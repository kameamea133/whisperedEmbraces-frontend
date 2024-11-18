import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Pause, Music} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { togglePlayPause, setPlaying } from '../slices/musicSlice';

const BackgroundMusic = () => {
  const audioRef = useRef(new Audio('/bgMusic.mp3'));
  const isPlaying = useSelector(state => state.music.isPlaying);
  const dispatch = useDispatch();

  useEffect(() => {
    const audio = audioRef.current;
    audio.loop = true;
    audio.volume = 1;

    if (isPlaying) {
      audio.play().catch(err => {
        console.log('Error playing audio:', err);
        dispatch(setPlaying(false));
      });
    } else {
      audio.pause();
    }

    return () => {
      audio.pause();
    };
  }, [isPlaying, dispatch]);

  const togglePlayPauseHandler = () => {
    dispatch(togglePlayPause());
  };

  return (
    <div className="fixed bottom-4 right-8 z-50">
      <motion.button
        onClick={togglePlayPauseHandler}
        className="p-4 rounded-full bg-gradient-to-r from-blue-400 to-teal-500 text-white shadow-lg focus:outline-none hover:bg-opacity-90"
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

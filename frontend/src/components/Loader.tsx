import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-purple-900">
      <div className="relative w-32 h-32">
        <motion.div
          className="w-32 h-32 rounded-full border-4 border-blue-300 shadow-2xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
        />

        <motion.div
          className="absolute top-0 left-0 w-8 h-8 rounded-full bg-blue-100 shadow-md"
          animate={{
            x: [0, 40, 80, 40, 0],
            y: [0, -40, 0, 40, 0],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <motion.div
        className="mt-8 text-center text-white font-extrabold text-2xl tracking-wider"
        animate={{ opacity: [0, 1, 0.5, 1, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        Exploring the Cosmos...
      </motion.div>
    </div>
  );
};

export default Loader;

import { motion } from 'framer-motion';

function Loading() {
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <div className="text-center">
        <motion.div
          className="inline-block w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p className="mt-4 text-lg font-medium text-gray-700">Loading...</p>
      </div>
    </div>
  );
}

export default Loading;
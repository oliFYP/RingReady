import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-9xl font-bold text-primary-600">404</h1>
          <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6">Page Not Found</h2>
          <p className="text-xl text-gray-600 max-w-md mx-auto mb-8">
            Looks like you've stepped out of the ring. The page you're looking for doesn't exist.
          </p>
          <Link to="/" className="btn-primary text-lg px-8 py-3">
            Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default NotFound;
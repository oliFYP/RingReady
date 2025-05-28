import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaFistRaised,
  FaTicketAlt,
  FaCalendarAlt,
  FaUserFriends,
} from "react-icons/fa";

function Home() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/4761663/pexels-photo-4761663.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-dark bg-opacity-70"></div>
        </div>

        <div className="container-custom relative z-10 text-white">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="max-w-3xl"
          >
            <h1 className="mb-6 text-5xl md:text-6xl font-bold">
              Step Into The <span className="text-primary-500">Ring</span>
            </h1>
            <p className="mb-8 text-xl md:text-2xl text-gray-200">
              Connect with local boxing events, join as a fighter or spectator,
              and experience the thrill of the match.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/events" className="btn-primary text-lg px-8 py-3">
                Explore Events
              </Link>
              <Link
                to="/register"
                className="btn-outline border-white text-white hover:bg-white hover:text-dark text-lg px-8 py-3"
              >
                Join Now
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section bg-light">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Whether you're a fighter looking for your next match or a fan
              searching for the best boxing events, RingReady makes it simple.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="card p-6 text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                <FaUserFriends size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Create Account</h3>
              <p className="text-gray-600">
                Sign up as a boxer or spectator and customize your profile.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="card p-6 text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                <FaCalendarAlt size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Find Events</h3>
              <p className="text-gray-600">
                Browse upcoming boxing events in your area or create your own.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="card p-6 text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                <FaTicketAlt size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Book Tickets</h3>
              <p className="text-gray-600">
                Secure your spot with easy ticket purchasing for any event.
              </p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="card p-6 text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                <FaFistRaised size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Enjoy The Fight</h3>
              <p className="text-gray-600">
                Participate as a boxer or cheer from the audience as a
                spectator.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-primary-600 text-white">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="mb-8 lg:mb-0 lg:max-w-xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Step Into the Ring?
              </h2>
              <p className="text-xl text-primary-100">
                Join our community of boxers and boxing enthusiasts today.
                Create your account and start exploring events near you.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/register"
                className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-8"
              >
                Sign Up Now
              </Link>
              <Link
                to="/events"
                className="btn border-2 border-white text-white hover:bg-primary-700 text-lg px-8"
              >
                Browse Events
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section bg-light">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="mb-4">What Our Community Says</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from boxers and fans who have found their perfect match on
              RingReady.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="card p-8"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-300 mr-4"></div>
                <div>
                  <h4 className="font-semibold">Michael Rodriguez</h4>
                  <p className="text-sm text-gray-500">Amateur Boxer</p>
                </div>
              </div>
              <p className="text-gray-600">
                "RingReady helped me find local sparring events to prepare for
                my upcoming tournament. The platform is easy to use and I've
                connected with many other boxers in my weight class."
              </p>
            </motion.div>

            {/* Testimonial 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="card p-8"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-300 mr-4"></div>
                <div>
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-sm text-gray-500">Event Organizer</p>
                </div>
              </div>
              <p className="text-gray-600">
                "As someone who runs boxing events, RingReady has streamlined my
                entire process. The ticket sales feature is seamless, and I can
                easily manage registrations."
              </p>
            </motion.div>

            {/* Testimonial 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="card p-8"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-300 mr-4"></div>
                <div>
                  <h4 className="font-semibold">David Chen</h4>
                  <p className="text-sm text-gray-500">Boxing Fan</p>
                </div>
              </div>
              <p className="text-gray-600">
                "I love being able to discover local boxing matches in my area.
                The ticket purchasing is straightforward, and I can follow my
                favorite local boxers on their journey."
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;

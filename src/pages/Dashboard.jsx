import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import {
  FaTicketAlt,
  FaCalendarAlt,
  FaFistRaised,
  FaPlus,
} from "react-icons/fa";
import { format } from "date-fns";

function Dashboard() {
  const { currentUser, userProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [boxingEvents, setBoxingEvents] = useState([]);
  const [organizedEvents, setOrganizedEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("tickets");

  useEffect(() => {
    async function fetchUserData() {
      if (!currentUser) return;

      try {
        setLoading(true);

        // Fetch events the user has tickets for
        const eventsRef = collection(db, "events");
        const ticketsQuery = query(
          eventsRef,
          where("attendees", "array-contains", currentUser.uid),
          orderBy("date", "asc")
        );

        const ticketsSnapshot = await getDocs(ticketsQuery);
        const ticketsData = ticketsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date?.toDate() || new Date(),
        }));

        setTickets(ticketsData);

        // If user is a boxer, fetch events they're participating in
        if (userProfile?.role === "boxer") {
          const boxerQuery = query(
            eventsRef,
            where("boxers", "array-contains", currentUser.uid),
            orderBy("date", "asc")
          );

          const boxerSnapshot = await getDocs(boxerQuery);
          const boxerData = boxerSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            date: doc.data().date?.toDate() || new Date(),
          }));

          setBoxingEvents(boxerData);
        }

        // If user is an organizer, fetch events they've created
        if (userProfile?.role === "organizer") {
          const organizerQuery = query(
            eventsRef,
            where("createdBy", "==", currentUser.uid),
            orderBy("date", "asc")
          );

          const organizerSnapshot = await getDocs(organizerQuery);
          const organizerData = organizerSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            date: doc.data().date?.toDate() || new Date(),
          }));

          setOrganizedEvents(organizerData);

          // Set default active tab for organizer
          if (organizerData.length > 0) {
            setActiveTab("organized");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [currentUser, userProfile]);

  // Determine available tabs
  const tabs = [
    { id: "tickets", label: "My Tickets", icon: <FaTicketAlt /> },
    ...(userProfile?.role === "boxer"
      ? [{ id: "boxing", label: "My Fights", icon: <FaFistRaised /> }]
      : []),
    ...(userProfile?.role === "organizer"
      ? [{ id: "organized", label: "My Events", icon: <FaCalendarAlt /> }]
      : []),
  ];

  // Mock data for preview if needed
  const mockTickets = [
    {
      id: "1",
      title: "Amateur Boxing Championship",
      location: "Downtown Arena, New York",
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      ticketPrice: 25,
      imageUrl:
        "https://images.pexels.com/photos/4761671/pexels-photo-4761671.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
  ];

  // Choose data to display
  const displayTickets = tickets.length > 0 ? tickets : mockTickets;
  const displayBoxingEvents =
    boxingEvents.length > 0 ? boxingEvents : mockTickets;
  const displayOrganizedEvents =
    organizedEvents.length > 0 ? organizedEvents : mockTickets;

  return (
    <div className="pt-16 min-h-screen bg-gray-100">
      <section className="section">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                <p className="text-gray-600">
                  Welcome back, {userProfile?.displayName || "User"}!
                </p>
              </div>

              {userProfile?.role === "organizer" && (
                <Link
                  to="/create-event"
                  className="btn-primary mt-4 md:mt-0 flex items-center justify-center gap-2"
                >
                  <FaPlus />
                  <span>Create Event</span>
                </Link>
              )}
            </div>

            {/* Tabs */}
            <div className="mb-8">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px space-x-8">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? "border-primary-500 text-primary-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <span className="mr-2">{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Tab Content */}
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-lg font-medium text-gray-700">
                  Loading your data...
                </p>
              </div>
            ) : (
              <div>
                {/* My Tickets Tab */}
                {activeTab === "tickets" && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">My Tickets</h2>

                    {displayTickets.length === 0 ? (
                      <div className="text-center py-12 bg-white rounded-lg shadow-soft">
                        <h3 className="text-xl font-bold mb-2">
                          No tickets found
                        </h3>
                        <p className="text-gray-600 mb-6">
                          You haven't purchased any tickets yet.
                        </p>
                        <Link to="/events" className="btn-primary">
                          Browse Events
                        </Link>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayTickets.map((event) => (
                          <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="card overflow-hidden"
                          >
                            <div
                              className="h-40 bg-cover bg-center"
                              style={{
                                backgroundImage: `url(${
                                  event.imageUrl ||
                                  "https://images.pexels.com/photos/4761679/pexels-photo-4761679.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                                })`,
                              }}
                            >
                              <div className="h-full flex items-end p-4">
                                <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                  ${event.ticketPrice}
                                </span>
                              </div>
                            </div>

                            <div className="p-6">
                              <h3 className="text-xl font-bold mb-2">
                                {event.title}
                              </h3>
                              <div className="flex items-center text-gray-600 mb-1">
                                <FaCalendarAlt className="mr-2 text-primary-500" />
                                <span>
                                  {format(event.date, "EEEE, MMMM d, yyyy")}
                                </span>
                              </div>
                              <div className="flex items-center text-gray-600 mb-4">
                                <span className="mr-2">📍</span>
                                <span>{event.location}</span>
                              </div>

                              <Link
                                to={`/events/${event.id}`}
                                className="btn-primary w-full"
                              >
                                View Ticket
                              </Link>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* My Fights Tab */}
                {activeTab === "boxing" && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">My Fights</h2>

                    {displayBoxingEvents.length === 0 ? (
                      <div className="text-center py-12 bg-white rounded-lg shadow-soft">
                        <h3 className="text-xl font-bold mb-2">
                          No fights found
                        </h3>
                        <p className="text-gray-600 mb-6">
                          You haven't joined any boxing events yet.
                        </p>
                        <Link to="/events" className="btn-primary">
                          Find Events
                        </Link>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayBoxingEvents.map((event) => (
                          <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="card overflow-hidden"
                          >
                            <div
                              className="h-40 bg-cover bg-center"
                              style={{
                                backgroundImage: `url(${
                                  event.imageUrl ||
                                  "https://images.pexels.com/photos/4761679/pexels-photo-4761679.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                                })`,
                              }}
                            >
                              <div className="h-full w-full bg-gradient-to-t from-black/60 to-transparent flex items-end">
                                <div className="p-4 text-white">
                                  <span className="bg-secondary-500 text-dark px-3 py-1 rounded-full text-sm font-medium mb-2 inline-block">
                                    Fighter
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="p-6">
                              <h3 className="text-xl font-bold mb-2">
                                {event.title}
                              </h3>
                              <div className="flex items-center text-gray-600 mb-1">
                                <FaCalendarAlt className="mr-2 text-primary-500" />
                                <span>
                                  {format(event.date, "EEEE, MMMM d, yyyy")}
                                </span>
                              </div>
                              <div className="flex items-center text-gray-600 mb-4">
                                <span className="mr-2">📍</span>
                                <span>{event.location}</span>
                              </div>

                              <Link
                                to={`/events/${event.id}`}
                                className="btn-primary w-full"
                              >
                                Event Details
                              </Link>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* My Organized Events Tab */}
                {activeTab === "organized" && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">
                      My Organized Events
                    </h2>

                    {displayOrganizedEvents.length === 0 ? (
                      <div className="text-center py-12 bg-white rounded-lg shadow-soft">
                        <h3 className="text-xl font-bold mb-2">
                          No events found
                        </h3>
                        <p className="text-gray-600 mb-6">
                          You haven't created any events yet.
                        </p>
                        <Link to="/create-event" className="btn-primary">
                          Create Event
                        </Link>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {displayOrganizedEvents.map((event) => (
                          <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="card overflow-hidden"
                          >
                            <div className="flex flex-col md:flex-row">
                              <div
                                className="h-48 md:h-auto md:w-1/3 bg-cover bg-center"
                                style={{
                                  backgroundImage: `url(${
                                    event.imageUrl ||
                                    "https://images.pexels.com/photos/4761679/pexels-photo-4761679.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                                  })`,
                                }}
                              ></div>

                              <div className="p-6 md:w-2/3">
                                <h3 className="text-xl font-bold mb-2">
                                  {event.title}
                                </h3>
                                <div className="flex items-center text-gray-600 mb-1">
                                  <FaCalendarAlt className="mr-2 text-primary-500" />
                                  <span>
                                    {format(event.date, "EEEE, MMMM d, yyyy")}
                                  </span>
                                </div>
                                <div className="flex items-center text-gray-600 mb-4">
                                  <span className="mr-2">📍</span>
                                  <span>{event.location}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                  <div className="bg-gray-100 p-3 rounded-lg text-center">
                                    <p className="text-sm text-gray-600">
                                      Tickets Sold
                                    </p>
                                    <p className="text-xl font-bold">
                                      {event.ticketsSold || 0}
                                    </p>
                                  </div>
                                  <div className="bg-gray-100 p-3 rounded-lg text-center">
                                    <p className="text-sm text-gray-600">
                                      Registered Boxers
                                    </p>
                                    <p className="text-xl font-bold">
                                      {event.boxers?.length || 0}
                                    </p>
                                  </div>
                                </div>

                                <Link
                                  to={`/events/${event.id}`}
                                  className="btn-primary w-full"
                                >
                                  Manage Event
                                </Link>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;

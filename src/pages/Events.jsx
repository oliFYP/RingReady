import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaCalendarAlt, FaSearch, FaFilter } from 'react-icons/fa';
import { format } from 'date-fns';

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    dateRange: 'all',
    priceRange: 'all',
  });

  useEffect(() => {
    async function fetchEvents() {
      try {
        const eventsRef = collection(db, 'events');
        const eventsQuery = query(eventsRef, orderBy('date', 'asc'));
        const eventsSnapshot = await getDocs(eventsQuery);
        
        const eventsData = eventsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date?.toDate() || new Date(),
        }));
        
        setEvents(eventsData);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  // Filter events based on search term and filters
  const filteredEvents = events.filter(event => {
    // Search term filter
    if (searchTerm && !event.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !event.location.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Location filter
    if (filters.location && !event.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    
    // Date range filter
    if (filters.dateRange !== 'all') {
      const today = new Date();
      if (filters.dateRange === 'thisWeek') {
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);
        if (event.date < today || event.date > nextWeek) {
          return false;
        }
      } else if (filters.dateRange === 'thisMonth') {
        const nextMonth = new Date();
        nextMonth.setMonth(today.getMonth() + 1);
        if (event.date < today || event.date > nextMonth) {
          return false;
        }
      }
    }
    
    // Price range filter
    if (filters.priceRange !== 'all') {
      if (filters.priceRange === 'free' && event.ticketPrice > 0) {
        return false;
      } else if (filters.priceRange === 'paid' && event.ticketPrice === 0) {
        return false;
      } else if (filters.priceRange === 'under50' && event.ticketPrice > 50) {
        return false;
      } else if (filters.priceRange === 'under100' && event.ticketPrice > 100) {
        return false;
      }
    }
    
    return true;
  });

  // Reset filters
  const resetFilters = () => {
    setFilters({
      location: '',
      dateRange: 'all',
      priceRange: 'all',
    });
    setSearchTerm('');
  };

  // Mock events data if no events exist
  const mockEvents = [
    {
      id: '1',
      title: 'Amateur Boxing Championship',
      description: 'A showcase of the best amateur boxing talent in the region.',
      location: 'Downtown Arena, New York',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      ticketPrice: 25,
      capacity: 200,
      remaining: 120,
      imageUrl: 'https://images.pexels.com/photos/4761671/pexels-photo-4761671.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      id: '2',
      title: 'Fight Night: The Contenders',
      description: 'Watch rising stars compete for a chance at glory.',
      location: 'Silver Gloves Gym, Los Angeles',
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      ticketPrice: 35,
      capacity: 150,
      remaining: 80,
      imageUrl: 'https://images.pexels.com/photos/8752554/pexels-photo-8752554.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      id: '3',
      title: 'Golden Gloves Tournament',
      description: 'The prestigious annual tournament for amateur boxers.',
      location: 'City Sports Center, Chicago',
      date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
      ticketPrice: 45,
      capacity: 300,
      remaining: 150,
      imageUrl: 'https://images.pexels.com/photos/6765836/pexels-photo-6765836.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
  ];

  const displayEvents = events.length > 0 ? filteredEvents : mockEvents;

  return (
    <div className="pt-16 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-900 text-white py-16">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              Discover Boxing Events
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-primary-100 mb-8"
            >
              Find and book tickets for the best boxing events in your area
            </motion.p>
            
            {/* Search Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative max-w-xl mx-auto"
            >
              <div className="flex items-center bg-white rounded-lg overflow-hidden shadow-lg">
                <div className="flex-1">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search events by name or location"
                      className="w-full py-3 pl-10 pr-4 text-gray-700 focus:outline-none"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-3 transition-colors duration-200 flex items-center gap-2"
                >
                  <FaFilter />
                  <span>Filters</span>
                </button>
              </div>
            </motion.div>
            
            {/* Filter Options */}
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ 
                height: showFilters ? 'auto' : 0,
                opacity: showFilters ? 1 : 0
              }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg mt-4 overflow-hidden shadow-lg"
            >
              {showFilters && (
                <div className="p-4 text-left">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Location Filter */}
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        placeholder="Filter by city"
                        className="input"
                        value={filters.location}
                        onChange={(e) => setFilters({...filters, location: e.target.value})}
                      />
                    </div>
                    
                    {/* Date Range Filter */}
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Date Range
                      </label>
                      <select
                        className="input"
                        value={filters.dateRange}
                        onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                      >
                        <option value="all">All Dates</option>
                        <option value="thisWeek">This Week</option>
                        <option value="thisMonth">This Month</option>
                      </select>
                    </div>
                    
                    {/* Price Range Filter */}
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Price Range
                      </label>
                      <select
                        className="input"
                        value={filters.priceRange}
                        onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
                      >
                        <option value="all">All Prices</option>
                        <option value="free">Free</option>
                        <option value="under50">Under $50</option>
                        <option value="under100">Under $100</option>
                        <option value="paid">Paid Events</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={resetFilters}
                      className="text-primary-600 hover:text-primary-800 mr-4"
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Events Listing */}
      <section className="section bg-gray-100">
        <div className="container-custom">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-lg font-medium text-gray-700">Loading events...</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-8">
                <h2>{displayEvents.length} Events Found</h2>
                <div className="flex space-x-2">
                  {/* Additional sorting options could go here */}
                </div>
              </div>

              {displayEvents.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-soft">
                  <h3 className="text-2xl font-bold mb-2">No events found</h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your search or filters to find what you're looking for.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="btn-primary"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {displayEvents.map((event) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      viewport={{ once: true }}
                      whileHover={{ y: -5 }}
                      className="card overflow-hidden transition-all duration-300 h-full flex flex-col"
                    >
                      <div 
                        className="h-48 bg-cover bg-center"
                        style={{ 
                          backgroundImage: `url(${event.imageUrl || 'https://images.pexels.com/photos/4761679/pexels-photo-4761679.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'})` 
                        }}
                      >
                        <div className="h-full w-full bg-black bg-opacity-20 flex items-end p-4">
                          <div className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                            ${event.ticketPrice}
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-6 flex-grow flex flex-col">
                        <h3 className="text-xl font-bold mb-2 line-clamp-2">
                          {event.title}
                        </h3>
                        
                        <div className="mb-4 flex items-center text-gray-600">
                          <FaCalendarAlt className="mr-2 text-primary-500" />
                          <span>{format(event.date, 'EEEE, MMMM d, yyyy')}</span>
                        </div>
                        
                        <div className="mb-4 flex items-center text-gray-600">
                          <FaMapMarkerAlt className="mr-2 text-primary-500" />
                          <span>{event.location}</span>
                        </div>
                        
                        <p className="text-gray-600 mb-4 line-clamp-2 flex-grow">
                          {event.description || 'Join us for an exciting boxing event featuring talented fighters competing for glory.'}
                        </p>
                        
                        <div className="mt-2">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Capacity</span>
                            <span className="text-sm font-medium">
                              {event.remaining}/{event.capacity} available
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary-600 h-2 rounded-full" 
                              style={{ width: `${(1 - event.remaining / event.capacity) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <Link 
                          to={`/events/${event.id}`} 
                          className="mt-6 btn-primary w-full"
                        >
                          View Details
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default Events;
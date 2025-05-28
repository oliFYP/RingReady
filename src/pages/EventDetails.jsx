import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaTicketAlt, FaUser, FaUsers, FaBoxing } from 'react-icons/fa';
import { format } from 'date-fns';

function EventDetails() {
  const { id } = useParams();
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ticketCount, setTicketCount] = useState(1);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [boxerJoinLoading, setBoxerJoinLoading] = useState(false);
  const [boxerJoinSuccess, setBoxerJoinSuccess] = useState(false);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const eventRef = doc(db, 'events', id);
        const eventSnapshot = await getDoc(eventRef);
        
        if (eventSnapshot.exists()) {
          const eventData = {
            id: eventSnapshot.id,
            ...eventSnapshot.data(),
            date: eventSnapshot.data().date?.toDate() || new Date(),
          };
          
          setEvent(eventData);
          
          // Check if user has already purchased tickets or joined as boxer
          if (currentUser && eventData.attendees && eventData.attendees.includes(currentUser.uid)) {
            setPurchaseSuccess(true);
          }
          
          if (currentUser && userProfile?.role === 'boxer' && 
              eventData.boxers && eventData.boxers.includes(currentUser.uid)) {
            setBoxerJoinSuccess(true);
          }
        } else {
          setError('Event not found');
        }
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Failed to load event details');
      } finally {
        setLoading(false);
      }
    }

    fetchEvent();
  }, [id, currentUser, userProfile]);

  // Handle ticket purchase
  const handlePurchaseTickets = async () => {
    if (!currentUser) {
      navigate('/login', { state: { from: `/events/${id}` } });
      return;
    }

    try {
      setPurchaseLoading(true);
      
      // Update event in Firestore
      const eventRef = doc(db, 'events', id);
      await updateDoc(eventRef, {
        attendees: arrayUnion(currentUser.uid),
        ticketsSold: increment(ticketCount),
        remaining: increment(-ticketCount),
      });
      
      setPurchaseSuccess(true);
      
      // Fetch updated event data
      const updatedSnapshot = await getDoc(eventRef);
      if (updatedSnapshot.exists()) {
        setEvent({
          id: updatedSnapshot.id,
          ...updatedSnapshot.data(),
          date: updatedSnapshot.data().date?.toDate() || new Date(),
        });
      }
    } catch (err) {
      console.error('Error purchasing tickets:', err);
      setError('Failed to purchase tickets');
    } finally {
      setPurchaseLoading(false);
    }
  };

  // Handle boxer join request
  const handleBoxerJoin = async () => {
    if (!currentUser) {
      navigate('/login', { state: { from: `/events/${id}` } });
      return;
    }
    
    if (userProfile?.role !== 'boxer') {
      setError('Only users with boxer role can join as fighters');
      return;
    }

    try {
      setBoxerJoinLoading(true);
      
      // Update event in Firestore
      const eventRef = doc(db, 'events', id);
      await updateDoc(eventRef, {
        boxers: arrayUnion(currentUser.uid),
      });
      
      setBoxerJoinSuccess(true);
      
      // Fetch updated event data
      const updatedSnapshot = await getDoc(eventRef);
      if (updatedSnapshot.exists()) {
        setEvent({
          id: updatedSnapshot.id,
          ...updatedSnapshot.data(),
          date: updatedSnapshot.data().date?.toDate() || new Date(),
        });
      }
    } catch (err) {
      console.error('Error joining as boxer:', err);
      setError('Failed to join as boxer');
    } finally {
      setBoxerJoinLoading(false);
    }
  };

  // Mock event data if no event exists or while loading
  const mockEvent = {
    id: '1',
    title: 'Amateur Boxing Championship',
    description: 'A showcase of the best amateur boxing talent in the region. This event features multiple weight divisions and competitors of all skill levels. Come watch the future stars of boxing as they compete for regional titles and recognition.',
    location: 'Downtown Arena, New York',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    time: '7:00 PM',
    ticketPrice: 25,
    capacity: 200,
    remaining: 120,
    boxers: [],
    attendees: [],
    organizer: {
      name: 'NYC Boxing Association',
      id: 'org123',
    },
    imageUrl: 'https://images.pexels.com/photos/4761671/pexels-photo-4761671.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  };

  const displayEvent = event || mockEvent;

  return (
    <div className="pt-16 min-h-screen">
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="inline-block w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-lg font-medium text-gray-700">Loading event details...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Error</h2>
            <p className="text-gray-600 mb-8">{error}</p>
            <Link to="/events" className="btn-primary">
              Back to Events
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Event Header */}
          <section className="relative">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundImage: `url(${displayEvent.imageUrl || 'https://images.pexels.com/photos/4761679/pexels-photo-4761679.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'})` 
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-dark/80 to-dark/60"></div>
            </div>
            
            <div className="relative container-custom py-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-white max-w-4xl"
              >
                <h1 className="mb-4">{displayEvent.title}</h1>
                
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6 text-lg">
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-2 text-primary-500" />
                    <span>{format(displayEvent.date, 'EEEE, MMMM d, yyyy')}</span>
                  </div>
                  
                  <div className="hidden md:block h-4 w-px bg-gray-400 mx-2"></div>
                  
                  <div className="flex items-center">
                    <FaClock className="mr-2 text-primary-500" />
                    <span>{displayEvent.time || '7:00 PM'}</span>
                  </div>
                  
                  <div className="hidden md:block h-4 w-px bg-gray-400 mx-2"></div>
                  
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-primary-500" />
                    <span>{displayEvent.location}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <span className="inline-flex items-center bg-primary-600 text-white px-4 py-1 rounded-full text-lg font-medium">
                    <FaTicketAlt className="mr-2" />
                    ${displayEvent.ticketPrice}
                  </span>
                  
                  <span className="inline-flex items-center bg-gray-700 text-white px-4 py-1 rounded-full text-lg">
                    <FaUsers className="mr-2" />
                    {displayEvent.remaining}/{displayEvent.capacity} Seats Available
                  </span>
                </div>
              </motion.div>
            </div>
          </section>
          
          {/* Event Content */}
          <section className="section bg-white">
            <div className="container-custom">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Event Details */}
                <div className="lg:col-span-2">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">About This Event</h2>
                    <p className="text-gray-700 whitespace-pre-line">
                      {displayEvent.description}
                    </p>
                  </div>
                  
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Event Schedule</h2>
                    <div className="border-l-4 border-primary-500 pl-4">
                      <div className="mb-4">
                        <h3 className="font-semibold text-xl">{format(displayEvent.date, 'h:mm a')} - Doors Open</h3>
                        <p className="text-gray-600">Attendees can enter the venue</p>
                      </div>
                      <div className="mb-4">
                        <h3 className="font-semibold text-xl">{format(new Date(displayEvent.date.getTime() + 60 * 60 * 1000), 'h:mm a')} - First Bout</h3>
                        <p className="text-gray-600">Opening matches begin</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-xl">{format(new Date(displayEvent.date.getTime() + 3 * 60 * 60 * 1000), 'h:mm a')} - Main Event</h3>
                        <p className="text-gray-600">Featured match of the evening</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Venue Information</h2>
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <h3 className="font-semibold text-xl mb-2">{displayEvent.location}</h3>
                      <p className="text-gray-700 mb-4">
                        The venue is equipped with state-of-the-art boxing facilities and comfortable seating for all attendees.
                      </p>
                      <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                        <div className="w-full h-64 bg-gray-300 rounded-lg"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Ticket Purchase Sidebar */}
                <div className="lg:col-span-1">
                  <div className="sticky top-24">
                    <div className="card p-6 mb-6">
                      <h3 className="text-xl font-bold mb-4">Purchase Tickets</h3>
                      
                      {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                          {error}
                        </div>
                      )}
                      
                      {purchaseSuccess ? (
                        <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-4">
                          <h4 className="font-bold mb-2">Tickets Purchased!</h4>
                          <p>You're all set to attend this event.</p>
                        </div>
                      ) : (
                        <>
                          <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">
                              Number of Tickets
                            </label>
                            <div className="flex items-center">
                              <button 
                                onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-l"
                                disabled={ticketCount <= 1}
                              >
                                -
                              </button>
                              <input 
                                type="number" 
                                min="1" 
                                max={displayEvent.remaining}
                                value={ticketCount}
                                onChange={(e) => setTicketCount(Math.min(displayEvent.remaining, Math.max(1, parseInt(e.target.value) || 1)))}
                                className="w-16 text-center py-2 border-t border-b border-gray-300"
                              />
                              <button 
                                onClick={() => setTicketCount(Math.min(displayEvent.remaining, ticketCount + 1))}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-r"
                                disabled={ticketCount >= displayEvent.remaining}
                              >
                                +
                              </button>
                            </div>
                          </div>
                          
                          <div className="mb-6">
                            <div className="flex justify-between mb-2">
                              <span>Ticket Price:</span>
                              <span>${displayEvent.ticketPrice}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                              <span>Quantity:</span>
                              <span>x{ticketCount}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
                              <span>Total:</span>
                              <span>${displayEvent.ticketPrice * ticketCount}</span>
                            </div>
                          </div>
                          
                          <button
                            onClick={handlePurchaseTickets}
                            disabled={purchaseLoading || displayEvent.remaining < 1}
                            className="btn-primary w-full"
                          >
                            {purchaseLoading ? 'Processing...' : 'Purchase Tickets'}
                          </button>
                          
                          {!currentUser && (
                            <p className="text-sm text-gray-600 mt-2 text-center">
                              You'll need to{' '}
                              <Link to="/login" className="text-primary-600 hover:text-primary-700">
                                sign in
                              </Link>{' '}
                              to complete your purchase
                            </p>
                          )}
                        </>
                      )}
                    </div>
                    
                    {/* Boxer Join Section */}
                    {userProfile?.role === 'boxer' && (
                      <div className="card p-6">
                        <h3 className="text-xl font-bold mb-4">Join as Boxer</h3>
                        
                        {boxerJoinSuccess ? (
                          <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-4">
                            <h4 className="font-bold mb-2">Application Submitted!</h4>
                            <p>You've successfully applied to participate in this event as a boxer.</p>
                          </div>
                        ) : (
                          <>
                            <p className="text-gray-700 mb-4">
                              Interested in competing at this event? Submit your application to join as a boxer.
                            </p>
                            
                            <button
                              onClick={handleBoxerJoin}
                              disabled={boxerJoinLoading}
                              className="btn flex items-center justify-center gap-2 w-full bg-secondary-500 text-dark hover:bg-secondary-600"
                            >
                              <FaBoxing />
                              {boxerJoinLoading ? 'Submitting...' : 'Apply to Compete'}
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default EventDetails;
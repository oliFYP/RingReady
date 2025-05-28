import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FaCalendarAlt, FaMapMarkerAlt, FaMoneyBillAlt, FaUsers, FaImage } from 'react-icons/fa';
import { motion } from 'framer-motion';

function CreateEvent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();

  // Formik setup
  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      location: '',
      date: '',
      time: '',
      ticketPrice: 0,
      capacity: 100,
      image: null,
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Event title is required'),
      description: Yup.string().required('Event description is required'),
      location: Yup.string().required('Event location is required'),
      date: Yup.date().required('Event date is required').min(new Date(), 'Event date must be in the future'),
      time: Yup.string().required('Event time is required'),
      ticketPrice: Yup.number().min(0, 'Price cannot be negative').required('Ticket price is required'),
      capacity: Yup.number().min(1, 'Capacity must be at least 1').required('Capacity is required'),
      image: Yup.mixed(),
    }),
    onSubmit: async (values) => {
      if (!currentUser) {
        setError('You must be logged in to create an event');
        return;
      }

      if (userProfile?.role !== 'organizer') {
        setError('Only organizers can create events');
        return;
      }

      try {
        setLoading(true);
        setError('');

        let imageUrl = null;

        // Upload image if provided
        if (values.image) {
          const storageRef = ref(storage, `events/${Date.now()}_${values.image.name}`);
          await uploadBytes(storageRef, values.image);
          imageUrl = await getDownloadURL(storageRef);
        }

        // Create event document in Firestore
        const eventData = {
          title: values.title,
          description: values.description,
          location: values.location,
          date: new Date(`${values.date}T${values.time}`),
          time: values.time,
          ticketPrice: Number(values.ticketPrice),
          capacity: Number(values.capacity),
          remaining: Number(values.capacity),
          ticketsSold: 0,
          imageUrl: imageUrl,
          createdBy: currentUser.uid,
          organizerName: userProfile?.displayName || 'Event Organizer',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          boxers: [],
          attendees: [],
        };

        const docRef = await addDoc(collection(db, 'events'), eventData);
        navigate(`/events/${docRef.id}`);
      } catch (err) {
        console.error('Error creating event:', err);
        setError('Failed to create event. Please try again.');
      } finally {
        setLoading(false);
      }
    },
  });

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      formik.setFieldValue('image', file);
      
      // Create image preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="pt-16 min-h-screen">
      <section className="section bg-light">
        <div className="container-custom max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="card p-8"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Create Boxing Event</h1>
              <p className="text-gray-600">Fill out the form below to create a new boxing event</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={formik.handleSubmit} className="space-y-6">
              {/* Event Title */}
              <div>
                <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                  Event Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  className={`input ${
                    formik.touched.title && formik.errors.title ? 'border-red-500' : ''
                  }`}
                  placeholder="e.g., Amateur Boxing Championship"
                  {...formik.getFieldProps('title')}
                />
                {formik.touched.title && formik.errors.title && (
                  <p className="mt-1 text-sm text-red-500">{formik.errors.title}</p>
                )}
              </div>

              {/* Event Description */}
              <div>
                <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                  Event Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  className={`input ${
                    formik.touched.description && formik.errors.description ? 'border-red-500' : ''
                  }`}
                  placeholder="Describe your event..."
                  {...formik.getFieldProps('description')}
                ></textarea>
                {formik.touched.description && formik.errors.description && (
                  <p className="mt-1 text-sm text-red-500">{formik.errors.description}</p>
                )}
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-gray-700 font-medium mb-2">
                  <FaMapMarkerAlt className="inline-block mr-2 text-primary-600" />
                  Location
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  className={`input ${
                    formik.touched.location && formik.errors.location ? 'border-red-500' : ''
                  }`}
                  placeholder="e.g., Downtown Arena, New York"
                  {...formik.getFieldProps('location')}
                />
                {formik.touched.location && formik.errors.location && (
                  <p className="mt-1 text-sm text-red-500">{formik.errors.location}</p>
                )}
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date" className="block text-gray-700 font-medium mb-2">
                    <FaCalendarAlt className="inline-block mr-2 text-primary-600" />
                    Date
                  </label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    className={`input ${
                      formik.touched.date && formik.errors.date ? 'border-red-500' : ''
                    }`}
                    {...formik.getFieldProps('date')}
                  />
                  {formik.touched.date && formik.errors.date && (
                    <p className="mt-1 text-sm text-red-500">{formik.errors.date}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="time" className="block text-gray-700 font-medium mb-2">
                    <FaCalendarAlt className="inline-block mr-2 text-primary-600" />
                    Time
                  </label>
                  <input
                    id="time"
                    name="time"
                    type="time"
                    className={`input ${
                      formik.touched.time && formik.errors.time ? 'border-red-500' : ''
                    }`}
                    {...formik.getFieldProps('time')}
                  />
                  {formik.touched.time && formik.errors.time && (
                    <p className="mt-1 text-sm text-red-500">{formik.errors.time}</p>
                  )}
                </div>
              </div>

              {/* Ticket Price and Capacity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="ticketPrice" className="block text-gray-700 font-medium mb-2">
                    <FaMoneyBillAlt className="inline-block mr-2 text-primary-600" />
                    Ticket Price ($)
                  </label>
                  <input
                    id="ticketPrice"
                    name="ticketPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    className={`input ${
                      formik.touched.ticketPrice && formik.errors.ticketPrice ? 'border-red-500' : ''
                    }`}
                    placeholder="0.00"
                    {...formik.getFieldProps('ticketPrice')}
                  />
                  {formik.touched.ticketPrice && formik.errors.ticketPrice && (
                    <p className="mt-1 text-sm text-red-500">{formik.errors.ticketPrice}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="capacity" className="block text-gray-700 font-medium mb-2">
                    <FaUsers className="inline-block mr-2 text-primary-600" />
                    Capacity
                  </label>
                  <input
                    id="capacity"
                    name="capacity"
                    type="number"
                    min="1"
                    className={`input ${
                      formik.touched.capacity && formik.errors.capacity ? 'border-red-500' : ''
                    }`}
                    placeholder="100"
                    {...formik.getFieldProps('capacity')}
                  />
                  {formik.touched.capacity && formik.errors.capacity && (
                    <p className="mt-1 text-sm text-red-500">{formik.errors.capacity}</p>
                  )}
                </div>
              </div>

              {/* Event Image */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  <FaImage className="inline-block mr-2 text-primary-600" />
                  Event Image
                </label>
                <div className="mt-1 flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-h-48 rounded"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          formik.setFieldValue('image', null);
                        }}
                        className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2 text-center">
                      <div className="text-gray-600">
                        <FaImage className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2">Upload an image for your event</p>
                        <p className="text-sm text-gray-500">PNG, JPG, GIF up to 5MB</p>
                      </div>
                      <button
                        type="button"
                        className="btn-outline py-2 px-4"
                        onClick={() => document.getElementById('image-upload').click()}
                      >
                        Select Image
                      </button>
                      <input
                        id="image-upload"
                        name="image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="btn-primary w-full"
                  disabled={loading}
                >
                  {loading ? 'Creating Event...' : 'Create Event'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default CreateEvent;
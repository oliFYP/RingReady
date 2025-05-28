import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

function Register() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  // Formik setup
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      passwordConfirm: '',
      displayName: '',
      role: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
      passwordConfirm: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Please confirm your password'),
      displayName: Yup.string()
        .min(2, 'Name must be at least 2 characters')
        .required('Name is required'),
      role: Yup.string()
        .oneOf(['boxer', 'viewer', 'organizer'], 'Please select a valid role')
        .required('Please select your role'),
    }),
    onSubmit: async (values) => {
      try {
        setError('');
        setLoading(true);
        
        await register(
          values.email,
          values.password,
          values.displayName,
          values.role
        );
        
        navigate('/');
      } catch (err) {
        console.error(err);
        setError('Failed to create an account. ' + err.message);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="card p-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Create an Account</h2>
            <p className="text-gray-600">Join RingReady to get started</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className={`input ${
                  formik.touched.email && formik.errors.email ? 'border-red-500' : ''
                }`}
                placeholder="your@email.com"
                {...formik.getFieldProps('email')}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="mt-1 text-sm text-red-500">{formik.errors.email}</p>
              )}
            </div>

            {/* Display Name Field */}
            <div>
              <label htmlFor="displayName" className="block text-gray-700 font-medium mb-2">
                Full Name
              </label>
              <input
                id="displayName"
                name="displayName"
                type="text"
                className={`input ${
                  formik.touched.displayName && formik.errors.displayName ? 'border-red-500' : ''
                }`}
                placeholder="John Doe"
                {...formik.getFieldProps('displayName')}
              />
              {formik.touched.displayName && formik.errors.displayName && (
                <p className="mt-1 text-sm text-red-500">{formik.errors.displayName}</p>
              )}
            </div>

            {/* Role Selection */}
            <div>
              <label htmlFor="role" className="block text-gray-700 font-medium mb-2">
                I am joining as a
              </label>
              <div className="grid grid-cols-3 gap-4 mb-2">
                <div 
                  className={`border rounded-lg p-4 cursor-pointer transition-all text-center ${
                    formik.values.role === 'boxer' 
                      ? 'border-primary-500 bg-primary-50 text-primary-700' 
                      : 'border-gray-300 hover:border-primary-300'
                  }`}
                  onClick={() => formik.setFieldValue('role', 'boxer')}
                >
                  <p className="font-medium">Boxer</p>
                </div>
                <div 
                  className={`border rounded-lg p-4 cursor-pointer transition-all text-center ${
                    formik.values.role === 'viewer' 
                      ? 'border-primary-500 bg-primary-50 text-primary-700' 
                      : 'border-gray-300 hover:border-primary-300'
                  }`}
                  onClick={() => formik.setFieldValue('role', 'viewer')}
                >
                  <p className="font-medium">Viewer</p>
                </div>
                <div 
                  className={`border rounded-lg p-4 cursor-pointer transition-all text-center ${
                    formik.values.role === 'organizer' 
                      ? 'border-primary-500 bg-primary-50 text-primary-700' 
                      : 'border-gray-300 hover:border-primary-300'
                  }`}
                  onClick={() => formik.setFieldValue('role', 'organizer')}
                >
                  <p className="font-medium">Organizer</p>
                </div>
              </div>
              {formik.touched.role && formik.errors.role && (
                <p className="mt-1 text-sm text-red-500">{formik.errors.role}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className={`input ${
                  formik.touched.password && formik.errors.password ? 'border-red-500' : ''
                }`}
                placeholder="••••••••"
                {...formik.getFieldProps('password')}
              />
              {formik.touched.password && formik.errors.password && (
                <p className="mt-1 text-sm text-red-500">{formik.errors.password}</p>
              )}
            </div>

            {/* Password Confirmation Field */}
            <div>
              <label htmlFor="passwordConfirm" className="block text-gray-700 font-medium mb-2">
                Confirm Password
              </label>
              <input
                id="passwordConfirm"
                name="passwordConfirm"
                type="password"
                className={`input ${
                  formik.touched.passwordConfirm && formik.errors.passwordConfirm ? 'border-red-500' : ''
                }`}
                placeholder="••••••••"
                {...formik.getFieldProps('passwordConfirm')}
              />
              {formik.touched.passwordConfirm && formik.errors.passwordConfirm && (
                <p className="mt-1 text-sm text-red-500">{formik.errors.passwordConfirm}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-primary w-full"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Register;
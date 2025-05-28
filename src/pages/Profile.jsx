import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaFistRaised,
  FaTrophy,
  FaWeight,
} from "react-icons/fa";

function Profile() {
  const { currentUser, userProfile, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Initial form values
  const initialValues = {
    displayName: userProfile?.displayName || "",
    bio: userProfile?.bio || "",
    // Boxing specific fields
    weight: userProfile?.weight || "",
    experience: userProfile?.experience || "",
    wins: userProfile?.wins || 0,
    losses: userProfile?.losses || 0,
    draws: userProfile?.draws || 0,
  };

  // Formik setup
  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      displayName: Yup.string().required("Name is required"),
      bio: Yup.string(),
      weight: Yup.string(),
      experience: Yup.string(),
      wins: Yup.number().min(0, "Must be at least 0"),
      losses: Yup.number().min(0, "Must be at least 0"),
      draws: Yup.number().min(0, "Must be at least 0"),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError("");
        setSuccess("");

        await updateUserProfile(currentUser.uid, values);

        setSuccess("Profile updated successfully!");
        setIsEditing(false);
      } catch (err) {
        console.error("Error updating profile:", err);
        setError("Failed to update profile");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="pt-16 min-h-screen bg-gray-100">
      <section className="section">
        <div className="container-custom max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="card p-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">My Profile</h1>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-outline py-2"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
                {success}
              </div>
            )}

            {isEditing ? (
              <form onSubmit={formik.handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    Basic Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label
                        htmlFor="displayName"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        <FaUser className="inline-block mr-2 text-primary-600" />
                        Full Name
                      </label>
                      <input
                        id="displayName"
                        name="displayName"
                        type="text"
                        className={`input ${
                          formik.touched.displayName &&
                          formik.errors.displayName
                            ? "border-red-500"
                            : ""
                        }`}
                        {...formik.getFieldProps("displayName")}
                      />
                      {formik.touched.displayName &&
                        formik.errors.displayName && (
                          <p className="mt-1 text-sm text-red-500">
                            {formik.errors.displayName}
                          </p>
                        )}
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        <FaEnvelope className="inline-block mr-2 text-primary-600" />
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        className="input bg-gray-100"
                        value={currentUser?.email || ""}
                        disabled
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        Email cannot be changed
                      </p>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="bio"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      rows="4"
                      className={`input ${
                        formik.touched.bio && formik.errors.bio
                          ? "border-red-500"
                          : ""
                      }`}
                      placeholder="Tell us about yourself..."
                      {...formik.getFieldProps("bio")}
                    ></textarea>
                    {formik.touched.bio && formik.errors.bio && (
                      <p className="mt-1 text-sm text-red-500">
                        {formik.errors.bio}
                      </p>
                    )}
                  </div>
                </div>

                {/* Boxing Information (only for boxers) */}
                {userProfile?.role === "boxer" && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">
                      Boxing Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label
                          htmlFor="weight"
                          className="block text-gray-700 font-medium mb-2"
                        >
                          <FaWeight className="inline-block mr-2 text-primary-600" />
                          Weight Class
                        </label>
                        <select
                          id="weight"
                          name="weight"
                          className={`input ${
                            formik.touched.weight && formik.errors.weight
                              ? "border-red-500"
                              : ""
                          }`}
                          {...formik.getFieldProps("weight")}
                        >
                          <option value="">Select weight class</option>
                          <option value="flyweight">Flyweight (112 lbs)</option>
                          <option value="bantamweight">
                            Bantamweight (118 lbs)
                          </option>
                          <option value="featherweight">
                            Featherweight (126 lbs)
                          </option>
                          <option value="lightweight">
                            Lightweight (135 lbs)
                          </option>
                          <option value="welterweight">
                            Welterweight (147 lbs)
                          </option>
                          <option value="middleweight">
                            Middleweight (160 lbs)
                          </option>
                          <option value="lightheavyweight">
                            Light Heavyweight (175 lbs)
                          </option>
                          <option value="heavyweight">
                            Heavyweight (200+ lbs)
                          </option>
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="experience"
                          className="block text-gray-700 font-medium mb-2"
                        >
                          <FaFistRaised className="inline-block mr-2 text-primary-600" />
                          Experience Level
                        </label>
                        <select
                          id="experience"
                          name="experience"
                          className={`input ${
                            formik.touched.experience &&
                            formik.errors.experience
                              ? "border-red-500"
                              : ""
                          }`}
                          {...formik.getFieldProps("experience")}
                        >
                          <option value="">Select experience level</option>
                          <option value="beginner">Beginner (0-1 years)</option>
                          <option value="intermediate">
                            Intermediate (1-3 years)
                          </option>
                          <option value="advanced">Advanced (3-5 years)</option>
                          <option value="expert">Expert (5+ years)</option>
                          <option value="professional">Professional</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label
                          htmlFor="wins"
                          className="block text-gray-700 font-medium mb-2"
                        >
                          <FaTrophy className="inline-block mr-2 text-primary-600" />
                          Wins
                        </label>
                        <input
                          id="wins"
                          name="wins"
                          type="number"
                          min="0"
                          className={`input ${
                            formik.touched.wins && formik.errors.wins
                              ? "border-red-500"
                              : ""
                          }`}
                          {...formik.getFieldProps("wins")}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="losses"
                          className="block text-gray-700 font-medium mb-2"
                        >
                          Losses
                        </label>
                        <input
                          id="losses"
                          name="losses"
                          type="number"
                          min="0"
                          className={`input ${
                            formik.touched.losses && formik.errors.losses
                              ? "border-red-500"
                              : ""
                          }`}
                          {...formik.getFieldProps("losses")}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="draws"
                          className="block text-gray-700 font-medium mb-2"
                        >
                          Draws
                        </label>
                        <input
                          id="draws"
                          name="draws"
                          type="number"
                          min="0"
                          className={`input ${
                            formik.touched.draws && formik.errors.draws
                              ? "border-red-500"
                              : ""
                          }`}
                          {...formik.getFieldProps("draws")}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      formik.resetForm();
                      setIsEditing(false);
                      setError("");
                      setSuccess("");
                    }}
                    className="btn-outline"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-8">
                {/* Basic Information Display */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    Basic Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">
                        Full Name
                      </p>
                      <p className="text-lg">
                        {userProfile?.displayName || "Not set"}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">
                        Email Address
                      </p>
                      <p className="text-lg">{currentUser?.email}</p>
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <p className="text-sm font-medium text-gray-500">Role</p>
                      <p className="text-lg capitalize">
                        {userProfile?.role || "Not set"}
                      </p>
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <p className="text-sm font-medium text-gray-500">Bio</p>
                      <p className="text-lg">
                        {userProfile?.bio || "No bio provided"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Boxing Information Display (only for boxers) */}
                {userProfile?.role === "boxer" && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">
                      Boxing Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">
                          Weight Class
                        </p>
                        <p className="text-lg capitalize">
                          {userProfile?.weight || "Not set"}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">
                          Experience Level
                        </p>
                        <p className="text-lg capitalize">
                          {userProfile?.experience || "Not set"}
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-100 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4">
                        Fight Record
                      </h3>
                      <div className="flex items-center justify-center space-x-8">
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-500">
                            Wins
                          </p>
                          <p className="text-3xl font-bold text-green-600">
                            {userProfile?.wins || 0}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-500">
                            Losses
                          </p>
                          <p className="text-3xl font-bold text-red-600">
                            {userProfile?.losses || 0}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-500">
                            Draws
                          </p>
                          <p className="text-3xl font-bold text-blue-600">
                            {userProfile?.draws || 0}
                          </p>
                        </div>
                      </div>
                    </div>
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

export default Profile;

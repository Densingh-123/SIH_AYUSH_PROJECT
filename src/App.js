import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where,
  addDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './App.css';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA9mf3ra24HBI4gw5O2DF1Gr788hiiQ1Ws",
  authDomain: "ayush-d7ac2.firebaseapp.com",
  projectId: "ayush-d7ac2",
  storageBucket: "ayush-d7ac2.firebasestorage.app",
  messagingSenderId: "41938729149",
  appId: "1:41938729149:web:c69cd908564b5d5d229fd4",
  measurementId: "G-K49PQS1CHH"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// API base URL
const API_BASE_URL = "http://localhost:8000";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerChildren = {
  visible: { transition: { staggerChildren: 0.1 } }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};

// Header Component
const Header = ({ theme, toggleTheme, user, handleSignIn, handleSignOut }) => {
  return (
    <motion.header 
      className={`header ${theme}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120 }}
    >
      <div className="container">
        <Link to="/" className="logo">
          AYUSH BANDHAN
        </Link>
        <nav className="nav">
          <ul>
            <li>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/">Home</Link>
              </motion.div>
            </li>
            <li>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/search">Search</Link>
              </motion.div>
            </li>
            {user && (
              <>
                <li>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/add-patient">Add Patient</Link>
                  </motion.div>
                </li>
                <li>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/doctor-dashboard">Doctor Dashboard</Link>
                  </motion.div>
                </li>
              </>
            )}
            {user ? (
              <li className="user-menu">
                <motion.div 
                  className="user-profile"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to="/profile">
                    <img 
                      src={user.photoURL || '/default-avatar.png'} 
                      alt={user.displayName || 'User'} 
                      className="user-avatar"
                    />
                  </Link>
                </motion.div>
              </li>
            ) : (
              <li>
                <motion.button 
                  onClick={handleSignIn} 
                  className="auth-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign In
                </motion.button>
              </li>
            )}
            <li>
              <motion.button 
                onClick={toggleTheme} 
                className="theme-toggle"
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </motion.button>
            </li>
          </ul>
        </nav>
      </div>
    </motion.header>
  );
};

// Auth Modal Component
const AuthModal = ({ isOpen, onClose, onSwitchMode, authMode, onAuth }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (authMode === 'signup' && password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      await onAuth(email, password, name, authMode);
      onClose();
    } catch (error) {
      setError(error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div 
      className="auth-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="auth-modal"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>{authMode === 'login' ? 'Sign In' : 'Create Account'}</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          {authMode === 'signup' && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          {authMode === 'signup' && (
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}
          
          <motion.button 
            type="submit"
            className="auth-submit-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {authMode === 'login' ? 'Sign In' : 'Create Account'}
          </motion.button>
        </form>
        
        <div className="auth-divider">
          <span>OR</span>
        </div>
        
        <motion.button 
          className="google-auth-btn"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Sign in with Google
        </motion.button>
        
        <div className="auth-switch">
          {authMode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button type="button" onClick={() => onSwitchMode('signup')}>
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button type="button" onClick={() => onSwitchMode('login')}>
                Sign in
              </button>
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// Profile Page Component
const ProfilePage = ({ user }) => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    gender: '',
    dob: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    specialty: '',
    education: '',
    experience: '',
    availability: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData(data);
            setFormData({
              name: data.name || user.displayName || '',
              email: data.email || user.email || '',
              age: data.age || '',
              gender: data.gender || '',
              dob: data.dob || '',
              phone: data.phone || '',
              address: data.address || '',
              city: data.city || '',
              state: data.state || '',
              zip: data.zip || '',
              specialty: data.specialty || '',
              education: data.education || '',
              experience: data.experience || '',
              availability: data.availability || ''
            });
          } else {
            // Create a basic user document if it doesn't exist
            const userData = {
              name: user.displayName || '',
              email: user.email || '',
              createdAt: serverTimestamp()
            };
            await setDoc(doc(db, 'users', user.uid), userData);
            setUserData(userData);
            setFormData({ ...formData, ...userData });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      await setDoc(doc(db, 'users', user.uid), {
        ...userData,
        ...formData,
        updatedAt: serverTimestamp()
      }, { merge: true });
      
      setUserData({ ...userData, ...formData });
      setIsEditing(false);
      
      // Update auth profile if name changed
      if (formData.name !== user.displayName) {
        await updateProfile(auth.currentUser, {
          displayName: formData.name
        });
      }
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  if (!user) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="not-signed-in">
            <h2>Please sign in to view your profile</h2>
            <Link to="/" className="cta-button">Go to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="profile-header"
        >
          <div className="profile-avatar">
            <img 
              src={user.photoURL || '/default-avatar.png'} 
              alt={user.displayName || 'User'} 
            />
          </div>
          <div className="profile-info">
            <h2>{userData?.name || user.displayName || 'User'}</h2>
            <p>{userData?.specialty || 'Healthcare Professional'}</p>
            <p>{userData?.email || user.email}</p>
          </div>
          <motion.button 
            className="edit-btn"
            onClick={() => setIsEditing(!isEditing)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </motion.button>
        </motion.div>

        <div className="profile-content">
          <div className="profile-section">
            <h3>Personal Information</h3>
            <div className="profile-details">
              <div className="detail-row">
                <label>Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span>{userData?.name || 'Not provided'}</span>
                )}
              </div>
              <div className="detail-row">
                <label>Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span>{userData?.email || user.email || 'Not provided'}</span>
                )}
              </div>
              <div className="detail-row">
                <label>Age</label>
                {isEditing ? (
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span>{userData?.age || 'Not provided'}</span>
                )}
              </div>
              <div className="detail-row">
                <label>Gender</label>
                {isEditing ? (
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                ) : (
                  <span>{userData?.gender ? userData.gender.charAt(0).toUpperCase() + userData.gender.slice(1) : 'Not provided'}</span>
                )}
              </div>
              <div className="detail-row">
                <label>Date of Birth</label>
                {isEditing ? (
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span>{userData?.dob || 'Not provided'}</span>
                )}
              </div>
              <div className="detail-row">
                <label>Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span>{userData?.phone || 'Not provided'}</span>
                )}
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h3>Address Information</h3>
            <div className="profile-details">
              <div className="detail-row">
                <label>Address</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span>{userData?.address || 'Not provided'}</span>
                )}
              </div>
              <div className="detail-row">
                <label>City</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span>{userData?.city || 'Not provided'}</span>
                )}
              </div>
              <div className="detail-row">
                <label>State</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span>{userData?.state || 'Not provided'}</span>
                )}
              </div>
              <div className="detail-row">
                <label>ZIP Code</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span>{userData?.zip || 'Not provided'}</span>
                )}
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h3>Professional Information</h3>
            <div className="profile-details">
              <div className="detail-row">
                <label>Specialty</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleInputChange}
                    placeholder="e.g., Cardiologist, Ayurvedic Practitioner"
                  />
                ) : (
                  <span>{userData?.specialty || 'Not provided'}</span>
                )}
              </div>
              <div className="detail-row">
                <label>Education</label>
                {isEditing ? (
                  <textarea
                    name="education"
                    value={formData.education}
                    onChange={handleInputChange}
                    placeholder="Degrees, certifications, etc."
                  />
                ) : (
                  <span>{userData?.education || 'Not provided'}</span>
                )}
              </div>
              <div className="detail-row">
                <label>Experience</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    placeholder="Years of experience"
                  />
                ) : (
                  <span>{userData?.experience || 'Not provided'}</span>
                )}
              </div>
              <div className="detail-row">
                <label>Availability</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="availability"
                    value={formData.availability}
                    onChange={handleInputChange}
                    placeholder="e.g., Mon-Fri 9am-5pm"
                  />
                ) : (
                  <span>{userData?.availability || 'Not provided'}</span>
                )}
              </div>
            </div>
          </div>

          {isEditing && (
            <motion.div 
              className="save-section"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.button 
                className="save-btn"
                onClick={handleSave}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Save Changes
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

// Patient Registration Form Component
const PatientForm = () => {
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    gender: '',
    dob: '',
    age: '',
    nationalId: '',
    
    // Contact Information
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    
    // Medical Information
    bloodGroup: '',
    allergies: '',
    chronicIllnesses: '',
    currentMedications: '',
    pastMedicalHistory: '',
    familyMedicalHistory: '',
    vaccinationHistory: '',
    
    // Emergency Contact
    emergencyName: '',
    emergencyRelationship: '',
    emergencyPhone: '',
    
    // Insurance Information
    insuranceProvider: '',
    policyNumber: '',
    validity: '',
    insuranceContact: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-calculate age if DOB changes
    if (name === 'dob' && value) {
      const birthDate = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      setFormData(prev => ({
        ...prev,
        age: age > 0 ? age.toString() : ''
      }));
    }
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('You must be logged in to register a patient');
      }
      
      await addDoc(collection(db, 'patients'), {
        ...formData,
        createdBy: user.uid,
        createdAt: serverTimestamp()
      });
      
      setSubmitStatus('success');
      setFormData({
        fullName: '',
        gender: '',
        dob: '',
        age: '',
        nationalId: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        bloodGroup: '',
        allergies: '',
        chronicIllnesses: '',
        currentMedications: '',
        pastMedicalHistory: '',
        familyMedicalHistory: '',
        vaccinationHistory: '',
        emergencyName: '',
        emergencyRelationship: '',
        emergencyPhone: '',
        insuranceProvider: '',
        policyNumber: '',
        validity: '',
        insuranceContact: ''
      });
    } catch (error) {
      console.error('Error submitting patient form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className="patient-form-page">
        <div className="container">
          <div className="success-message">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2>Patient Registered Successfully!</h2>
              <p>The patient information has been saved to the database.</p>
              <div className="success-actions">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSubmitStatus(null)}
                >
                  Register Another Patient
                </motion.button>
                <Link to="/doctor-dashboard" className="cta-button">
                  Go to Dashboard
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="patient-form-page">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="form-header"
        >
          <h2>Patient Registration</h2>
          <div className="step-indicator">
            <span className={currentStep >= 1 ? 'active' : ''}>1. Personal</span>
            <span className={currentStep >= 2 ? 'active' : ''}>2. Contact</span>
            <span className={currentStep >= 3 ? 'active' : ''}>3. Medical</span>
            <span className={currentStep >= 4 ? 'active' : ''}>4. Emergency</span>
            <span className={currentStep >= 5 ? 'active' : ''}>5. Insurance</span>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit} className="patient-form">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="form-step"
            >
              <h3>Personal Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Gender *</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Date of Birth *</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    readOnly
                  />
                </div>
                <div className="form-group full-width">
                  <label>National ID / Passport No</label>
                  <input
                    type="text"
                    name="nationalId"
                    value={formData.nationalId}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-navigation">
                <button type="button" className="next-btn" onClick={nextStep}>
                  Next: Contact Information
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Contact Information */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="form-step"
            >
              <h3>Contact Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>ZIP Code *</label>
                  <input
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Country *</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="form-navigation">
                <button type="button" className="prev-btn" onClick={prevStep}>
                  Previous: Personal Information
                </button>
                <button type="button" className="next-btn" onClick={nextStep}>
                  Next: Medical Information
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Medical Information */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="form-step"
            >
              <h3>Medical Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Blood Group</label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label>Known Allergies</label>
                  <textarea
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleInputChange}
                    placeholder="List any known allergies (medications, foods, environmental, etc.)"
                    rows="3"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Chronic Illnesses</label>
                  <textarea
                    name="chronicIllnesses"
                    value={formData.chronicIllnesses}
                    onChange={handleInputChange}
                    placeholder="e.g., Diabetes, Hypertension, Asthma, etc."
                    rows="3"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Current Medications</label>
                  <textarea
                    name="currentMedications"
                    value{...formData.currentMedications}
                    onChange={handleInputChange}
                    placeholder="Medication name, dosage, frequency"
                    rows="3"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Past Medical History</label>
                  <textarea
                    name="pastMedicalHistory"
                    value={formData.pastMedicalHistory}
                    onChange={handleInputChange}
                    placeholder="Surgeries, hospitalizations, major illnesses"
                    rows="3"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Family Medical History (optional)</label>
                  <textarea
                    name="familyMedicalHistory"
                    value={formData.familyMedicalHistory}
                    onChange={handleInputChange}
                    placeholder="Diabetes, heart disease, genetic disorders in family"
                    rows="3"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Vaccination History (optional)</label>
                  <textarea
                    name="vaccinationHistory"
                    value={formData.vaccinationHistory}
                    onChange={handleInputChange}
                    placeholder="COVID-19, hepatitis, flu shots, etc."
                    rows="3"
                  />
                </div>
              </div>
              <div className="form-navigation">
                <button type="button" className="prev-btn" onClick={prevStep}>
                  Previous: Contact Information
                </button>
                <button type="button" className="next-btn" onClick={nextStep}>
                  Next: Emergency Contact
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Emergency Contact */}
          {currentStep === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="form-step"
            >
              <h3>Emergency Contact</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="emergencyName"
                    value={formData.emergencyName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Relationship *</label>
                  <input
                    type="text"
                    name="emergencyRelationship"
                    value={formData.emergencyRelationship}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Spouse, Parent, Sibling"
                  />
                </div>
                <div className="form-group">
                  <label>Contact Number *</label>
                  <input
                    type="tel"
                    name="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="form-navigation">
                <button type="button" className="prev-btn" onClick={prevStep}>
                  Previous: Medical Information
                </button>
                <button type="button" className="next-btn" onClick={nextStep}>
                  Next: Insurance Information
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 5: Insurance Information */}
          {currentStep === 5 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="form-step"
            >
              <h3>Insurance Information (Optional)</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Insurance Provider</label>
                  <input
                    type="text"
                    name="insuranceProvider"
                    value={formData.insuranceProvider}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Policy Number</label>
                  <input
                    type="text"
                    name="policyNumber"
                    value={formData.policyNumber}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Validity</label>
                  <input
                    type="date"
                    name="validity"
                    value={formData.validity}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Insurance Contact Info</label>
                  <input
                    type="text"
                    name="insuranceContact"
                    value={formData.insuranceContact}
                    onChange={handleInputChange}
                    placeholder="Phone number or email"
                  />
                </div>
              </div>
              <div className="form-navigation">
                <button type="button" className="prev-btn" onClick={prevStep}>
                  Previous: Emergency Contact
                </button>
                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Register Patient'}
                </button>
              </div>
            </motion.div>
          )}

          {submitStatus === 'error' && (
            <div className="error-message">
              There was an error submitting the form. Please try again.
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

// Doctor Dashboard Component
const DoctorDashboard = () => {
  const [doctorData, setDoctorData] = useState(null);
  const [patients, setPatients] = useState([]);
  const [stats, setStats] = useState({
    totalPatients: 0,
    ayurveda: 0,
    siddha: 0,
    unani: 0,
    icd11: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        // Fetch doctor data
        const doctorDoc = await getDoc(doc(db, 'users', user.uid));
        if (doctorDoc.exists()) {
          setDoctorData(doctorDoc.data());
        }

        // Fetch patients created by this doctor
        const q = query(collection(db, 'patients'), where("createdBy", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const patientsData = [];
        querySnapshot.forEach((doc) => {
          patientsData.push({ id: doc.id, ...doc.data() });
        });
        setPatients(patientsData);

        // Calculate stats (for demo, we'll use mock data)
        setStats({
          totalPatients: patientsData.length,
          ayurveda: Math.floor(Math.random() * 10),
          siddha: Math.floor(Math.random() * 8),
          unani: Math.floor(Math.random() * 6),
          icd11: Math.floor(Math.random() * 12)
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  if (!auth.currentUser) {
    return (
      <div className="doctor-dashboard">
        <div className="container">
          <div className="not-signed-in">
            <h2>Please sign in to view your dashboard</h2>
            <Link to="/" className="cta-button">Go to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="doctor-dashboard">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="dashboard-header"
        >
          <div className="doctor-info">
            <h2>Doctor Dashboard</h2>
            <p>Welcome back, {doctorData?.name || 'Doctor'}</p>
          </div>
          <div className="dashboard-actions">
            <Link to="/add-patient" className="cta-button">
              Add New Patient
            </Link>
          </div>
        </motion.div>

        <div className="stats-grid">
          <motion.div 
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>{stats.totalPatients}</h3>
              <p>Total Patients</p>
            </div>
          </motion.div>
          <motion.div 
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="stat-icon">🌿</div>
            <div className="stat-content">
              <h3>{stats.ayurveda}</h3>
              <p>Ayurveda Cases</p>
            </div>
          </motion.div>
          <motion.div 
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="stat-icon">🍃</div>
            <div className="stat-content">
              <h3>{stats.siddha}</h3>
              <p>Siddha Cases</p>
            </div>
          </motion.div>
          <motion.div 
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="stat-icon">🌱</div>
            <div className="stat-content">
              <h3>{stats.unani}</h3>
              <p>Unani Cases</p>
            </div>
          </motion.div>
          <motion.div 
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="stat-icon">🏥</div>
            <div className="stat-content">
              <h3>{stats.icd11}</h3>
              <p>ICD-11 Cases</p>
            </div>
          </motion.div>
        </div>

        <div className="dashboard-content">
          <div className="recent-patients">
            <h3>Recent Patients</h3>
            {patients.length > 0 ? (
              <div className="patients-list">
                {patients.slice(0, 5).map((patient, index) => (
                  <motion.div 
                    key={index}
                    className="patient-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="patient-info">
                      <h4>{patient.fullName}</h4>
                      <p>{patient.gender}, {patient.age} years</p>
                    </div>
                    <div className="patient-contact">
                      <p>{patient.phone}</p>
                      <p>{patient.city}, {patient.state}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="no-patients">
                <p>No patients registered yet.</p>
                <Link to="/add-patient" className="cta-button">
                  Register Your First Patient
                </Link>
              </div>
            )}
          </div>

          <div className="doctor-details">
            <h3>Your Information</h3>
            <div className="details-card">
              {doctorData ? (
                <>
                  <div className="detail-row">
                    <label>Name:</label>
                    <span>{doctorData.name || 'Not provided'}</span>
                  </div>
                  <div className="detail-row">
                    <label>Specialty:</label>
                    <span>{doctorData.specialty || 'Not specified'}</span>
                  </div>
                  <div className="detail-row">
                    <label>Education:</label>
                    <span>{doctorData.education || 'Not provided'}</span>
                  </div>
                  <div className="detail-row">
                    <label>Experience:</label>
                    <span>{doctorData.experience || 'Not provided'}</span>
                  </div>
                  <div className="detail-row">
                    <label>Availability:</label>
                    <span>{doctorData.availability || 'Not specified'}</span>
                  </div>
                </>
              ) : (
                <p>Loading your information...</p>
              )}
              <div className="edit-profile-btn">
                <Link to="/profile">Edit Profile</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Hero Section Component
const HeroSection = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  return (
    <section className="hero" ref={ref}>
      <div className="hero-content">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          ICD–TM2 API Integration Platform
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Bridging Modern EHR Systems with Traditional Medicine Knowledge (Ayurveda, Siddha, Unani, ICD11)
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link to="/search" className="cta-button">Get Started</Link>
        </motion.div>
      </div>
      <div className="hero-visual">
        <motion.div 
          className="doctor-icon"
          animate={{ 
            y: [0, -10, 0],
          }}
          transition={{ 
            repeat: Infinity,
            duration: 3,
            ease: "easeInOut"
          }}
        >
          
        </motion.div>
        <motion.div 
          className="data-flow"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <motion.div 
            className="flow-item"
            whileHover={{ scale: 1.1, backgroundColor: "var(--primary-color)", color: "white" }}
          >
            FEHR
          </motion.div>
          <div className="flow-arrow">→</div>
          <motion.div 
            className="flow-item"
            whileHover={{ scale: 1.1, backgroundColor: "var(--secondary-color)", color: "white" }}
          >
            ICD-II
          </motion.div>
          <div className="flow-arrow">→</div>
          <motion.div 
            className="flow-item"
            whileHover={{ scale: 1.1, backgroundColor: "var(--accent-color)", color: "white" }}
          >
            NAMASTE
          </motion.div>
          <div className="flow-arrow">→</div>
          <div className="medicine-icons">
            <motion.span 
              className="medicine-icon"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, delay: 0 }}
            >
              🌿
            </motion.span>
            <motion.span 
              className="medicine-icon"
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ repeat: Infinity, duration: 4, delay: 1 }}
            >
              🍃
            </motion.span>
            <motion.span 
              className="medicine-icon"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, delay: 2 }}
            >
              🌱
            </motion.span>
            <motion.span 
              className="medicine-icon"
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ repeat: Infinity, duration: 4, delay: 3 }}
            >
              🏥
            </motion.span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Value Proposition Component
const ValueProposition = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <section className="value-proposition" ref={ref}>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        Why It Matters
      </motion.h2>
      <motion.div 
        className="value-items"
        variants={staggerChildren}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <motion.div className="value-item" variants={fadeIn}>
          <div className="value-icon">✅</div>
          <h3>Interoperability with EHR Standards (India)</h3>
          <p>Seamlessly integrates with existing Electronic Health Record systems</p>
        </motion.div>
        <motion.div className="value-item" variants={fadeIn}>
          <div className="value-icon">✅</div>
          <h3>ICD Classification Integration</h3>
          <p>Ensures accurate diagnoses with standardized coding</p>
        </motion.div>
        <motion.div className="value-item" variants={fadeIn}>
          <div className="value-icon">✅</div>
          <h3>Traditional Medicine Support</h3>
          <p>Comprehensive support for Ayurveda, Siddha, and Unani systems</p>
        </motion.div>
        <motion.div className="value-item" variants={fadeIn}>
          <div className="value-icon">✅</div>
          <h3>Unified Search across all systems</h3>
          <p>Find treatments across all traditional medicine systems in one place</p>
        </motion.div>
      </motion.div>
    </section>
  );
};

// Features Component
const Features = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <section className="features" ref={ref}>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        Key Features
      </motion.h2>
      <motion.div 
        className="features-grid"
        variants={staggerChildren}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <motion.div className="feature-card" variants={scaleIn}>
          <div className="feature-icon">🔎</div>
          <h3>Common Search</h3>
          <p>Search by symptoms or diseases (e.g., "fever") across all traditional medicine systems</p>
        </motion.div>
        <motion.div className="feature-card" variants={scaleIn}>
          <div className="feature-icon">📚</div>
          <h3>Knowledge Base</h3>
          <p>Ayurveda, Siddha, Unani medicines mapped to ICD codes for standardized reference</p>
        </motion.div>
        <motion.div className="feature-card" variants={scaleIn}>
          <div className="feature-icon">🔗</div>
          <h3>API Ready</h3>
          <p>Easily plug into EMR/EHR systems with our comprehensive API</p>
        </motion.div>
        <motion.div className="feature-card" variants={scaleIn}>
          <div className="feature-icon">⚙️</div>
          <h3>Custom Filters</h3>
          <p>Choose the medical system of interest and filter results accordingly</p>
        </motion.div>
      </motion.div>
    </section>
  );
};

// Landing Page Component
const LandingPage = () => {
  return (
    <div className="landing-page">
      <HeroSection />
      <div className="intro-section">
        <div className="container">
          <motion.p 
            className="intro-text"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            This platform integrates NAMASTE and ICD-II via the Traditional Medicine Module 2 (TM2) into EMR systems, enabling healthcare providers to access standardized diagnosis codes and traditional medicine treatments seamlessly.
          </motion.p>
        </div>
      </div>
      <ValueProposition />
      <Features />
    </div>
  );
};

// API fetch utility function
const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// System-specific card component
const SystemCard = ({ item, system }) => {
  return (
    <motion.div 
      className="result-card"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
    >
      <Link 
        to="/details" 
        state={{ item, system }}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <div className="card-header">
          <h5>{item.english_name || item.display_name || item.title}</h5>
          <span className="icd-code">{item.code || 'No code'}</span>
        </div>
        
        <div className="card-content">
          {system === 'Ayurveda' && (
            <>
              {item.hindi_name && <p><strong>Hindi:</strong> {item.hindi_name}</p>}
              {item.diacritical_name && <p><strong>Diacritical:</strong> {item.diacritical_name}</p>}
            </>
          )}
          
          {system === 'Siddha' && (
            <>
              {item.tamil_name && <p><strong>Tamil:</strong> {item.tamil_name}</p>}
              {item.romanized_name && <p><strong>Romanized:</strong> {item.romanized_name}</p>}
            </>
          )}
          
          {system === 'Unani' && (
            <>
              {item.arabic_name && <p><strong>Arabic:</strong> {item.arabic_name}</p>}
              {item.romanized_name && <p><strong>Romanized:</strong> {item.romanized_name}</p>}
            </>
          )}
          
          {system === 'ICD-11' && (
            <>
              {item.title && <p><strong>Title:</strong> {item.title}</p>}
              {item.chapter_no && <p><strong>Chapter:</strong> {item.chapter_no}</p>}
              {item.foundation_uri && (
                <p className="uri-truncate"><strong>URI:</strong> {item.foundation_uri}</p>
              )}
              {item.is_leaf !== undefined && (
                <div className="leaf-indicator">
                  <span className="label">Is Leaf:</span>
                  <span className={`status ${item.is_leaf ? 'active' : 'inactive'}`}>
                    {item.is_leaf ? 'Yes' : 'No'}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

// Search Page Component (updated for mappings)
const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSystem, setSelectedSystem] = useState('ayurveda');
  const [minConfidence, setMinConfidence] = useState(0.1);
  const [results, setResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    
    try {
      // Call the mappings endpoint
      const data = await fetchData(
        `${API_BASE_URL}/terminologies/mappings/?system=${selectedSystem}&q=${searchTerm}&min_confidence=${minConfidence}`
      );
      
      if (data && data.results) {
        setResults(data);
        console.log("API Response:", data);
      } else {
        setResults({ results: [] });
      }
    } catch (error) {
      console.error("Search error:", error);
      setResults({ results: [] });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="search-page">
      <div className="container">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Find Traditional Medicine Mappings
        </motion.h2>
        
        <motion.form 
          onSubmit={handleSearch} 
          className="search-form mapping-form"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="form-row">
            <div className="form-group">
              <label>Search Term</label>
              <input
                type="text"
                placeholder="Enter disease or condition (e.g., fever, diabetes)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
                required
              />
            </div>
            
            <div className="form-group">
              <label>System</label>
              <select
                value={selectedSystem}
                onChange={(e) => setSelectedSystem(e.target.value)}
                className="system-select"
              >
                <option value="ayurveda">Ayurveda</option>
                <option value="siddha">Siddha</option>
                <option value="unani">Unani</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Min Confidence</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="1.0"
                value={minConfidence}
                onChange={(e) => setMinConfidence(parseFloat(e.target.value))}
                className="confidence-input"
              />
            </div>
          </div>
          
          <motion.button 
            type="submit" 
            className="search-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isSearching}
          >
            {isSearching ? (
              <div className="loading-spinner"></div>
            ) : (
              "Search Mappings"
            )}
          </motion.button>
        </motion.form>

        <AnimatePresence>
          {results && results.results && results.results.length === 0 && (
            <motion.div 
              className="no-results"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <p>No mapping results found for "{searchTerm}". Try a different term.</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {results && results.results && results.results.length > 0 && (
            <motion.div 
              className="mapping-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="results-header">
                <h3>Mapping Results for "{searchTerm}" in {selectedSystem.charAt(0).toUpperCase() + selectedSystem.slice(1)}</h3>
                {results.pagination && (
                  <div className="pagination-info">
                    Page {results.pagination.page} of {results.pagination.total_pages} • 
                    {results.pagination.total_results} total results
                  </div>
                )}
              </div>
              
              <div className="mapping-table-container">
                <table className="mapping-table">
                  <thead>
                    <tr>
                      <th>Source System</th>
                      <th>Ayurveda</th>
                      <th>Siddha</th>
                      <th>Unani</th>
                      <th>ICD-11</th>
                      <th>Confidence</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.results.map((mapping, index) => (
                      <motion.tr 
                        key={mapping.mapping_id || index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="mapping-row"
                      >
                        <td>
                          <div className="source-term">
                            <div className="term-code">{mapping.source_term.code}</div>
                            <div className="term-name">{mapping.source_term.english_name}</div>
                          </div>
                        </td>
                        <td>
                          {mapping.namaste_terms.ayurveda ? (
                            <div className="system-term">
                              <div className="term-code">{mapping.namaste_terms.ayurveda.code}</div>
                              <div className="term-name">{mapping.namaste_terms.ayurveda.english_name}</div>
                            </div>
                          ) : (
                            <span className="no-data">-</span>
                          )}
                        </td>
                        <td>
                          {mapping.namaste_terms.siddha ? (
                            <div className="system-term">
                              <div className="term-code">{mapping.namaste_terms.siddha.code}</div>
                              <div className="term-name">{mapping.namaste_terms.siddha.english_name}</div>
                            </div>
                          ) : (
                            <span className="no-data">-</span>
                          )}
                        </td>
                        <td>
                          {mapping.namaste_terms.unani ? (
                            <div className="system-term">
                              <div className="term-code">{mapping.namaste_terms.unani.code}</div>
                              <div className="term-name">{mapping.namaste_terms.unani.english_name}</div>
                            </div>
                          ) : (
                            <span className="no-data">-</span>
                          )}
                        </td>
                        <td>
                          {mapping.icd_mapping ? (
                            <div className="system-term">
                              <div className="term-code">{mapping.icd_mapping.code}</div>
                              <div className="term-name">{mapping.icd_mapping.title}</div>
                            </div>
                          ) : (
                            <span className="no-data">-</span>
                          )}
                        </td>
                        <td>
                          <div className="confidence-score">
                            <div className="score-value">{(mapping.confidence_score * 100).toFixed(1)}%</div>
                            <div className="score-bar">
                              <div 
                                className="score-fill"
                                style={{ width: `${mapping.confidence_score * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <Link 
                            to="/mapping-details" 
                            state={{ mapping }}
                            className="view-button"
                          >
                            View Details
                          </Link>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {results.pagination && (
                <div className="pagination-controls">
                  <button 
                    disabled={!results.pagination.has_previous}
                    className="pagination-btn"
                  >
                    Previous
                  </button>
                  <span>Page {results.pagination.page} of {results.pagination.total_pages}</span>
                  <button 
                    disabled={!results.pagination.has_next}
                    className="pagination-btn"
                  >
                    Next
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          className="system-cards"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3>Explore by Medical System</h3>
          <div className="cards-container">
            <motion.div
              whileHover={{ y: -10, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link to="/ayurveda" className="system-card">
                <div className="system-icon">🌿</div>
                <h4>Ayurveda</h4>
                <p>Ancient Indian system of natural healing</p>
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ y: -10, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link to="/siddha" className="system-card">
                <div className="system-icon">🍃</div>
                <h4>Siddha</h4>
                <p>Traditional Tamil system of medicine</p>
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ y: -10, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link to="/unani" className="system-card">
                <div className="system-icon">🌱</div>
                <h4>Unani</h4>
                <p>Greco-Arabic system of medicine</p>
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ y: -10, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link to="/icd11" className="system-card">
                <div className="system-icon">🏥</div>
                <h4>ICD-11</h4>
                <p>International Classification of Diseases</p>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// System Page Component
const SystemPage = ({ systemName }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  
  const systemData = {
    ayurveda: {
      title: "Ayurveda",
      description: "Ancient Indian system of natural and holistic healing",
      image: "🌿",
      endpoint: `${API_BASE_URL}/terminologies/ayurveda/search/?q=`
    },
    siddha: {
      title: "Siddha",
      description: "One of the oldest traditional medicine systems from South India",
      image: "🍃",
      endpoint: `${API_BASE_URL}/terminologies/siddha/search/?q=`
    },
    unani: {
      title: "Unani",
      description: "Greco-Arabic system of medicine based on the teachings of Hippocrates",
      image: "🌱",
      endpoint: `${API_BASE_URL}/terminologies/unani/search/?q=`
    },
    icd11: {
      title: "ICD-11",
      description: "International Classification of Diseases 11th Revision",
      image: "🏥",
      endpoint: `${API_BASE_URL}/terminologies/icd11/search/?q=`
    }
  };

  const system = systemData[systemName];

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    
    try {
      const data = await fetchData(`${system.endpoint}${searchTerm}`);
      
      if (data && data.results) {
        setResults(data.results);
        console.log(`${system.title} API Response:`, data);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error(`${system.title} search error:`, error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="system-page">
      <div className="container">
        <motion.div 
          className="system-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="system-icon-large"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: 0 }}
          >
            {system.image}
          </motion.div>
          <div className="system-info">
            <h2>{system.title}</h2>
            <p>{system.description}</p>
          </div>
        </motion.div>

        <motion.form 
          onSubmit={handleSearch} 
          className="search-form"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <input
            type="text"
            placeholder={`Search ${system.title} treatments (e.g., fever, diabetes)`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <motion.button 
            type="submit" 
            className="search-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isSearching}
          >
            {isSearching ? (
              <div className="loading-spinner"></div>
            ) : (
              "Search"
            )}
          </motion.button>
        </motion.form>

        <AnimatePresence>
          {results && results.length === 0 && (
            <motion.div 
              className="no-results"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <p>No {system.title} results found for "{searchTerm}". Try searching for "fever" or "diabetes".</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {results && results.length > 0 && (
            <motion.div 
              className="system-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3>{system.title} Treatments for "{searchTerm}"</h3>
              <motion.div 
                className="results-grid"
                variants={staggerChildren}
                initial="hidden"
                animate="visible"
              >
                {results.map((item, index) => (
                  <SystemCard 
                    key={index} 
                    item={item} 
                    system={system.title}
                  />
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          className="system-info-content"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3>About {system.title}</h3>
          <p>
            {system.title} is a {system.title === 'ICD-11' ? 'modern international standard' : 'traditional system of medicine'} with {
              system.title === 'ICD-11' 
                ? 'global recognition for disease classification and health reporting.' 
                : 'historical roots in the Indian subcontinent. The system integrates natural elements and holistic approaches to prevent and treat health conditions.'
            }
          </p>
          <div className="system-benefits">
            <h4>Key Benefits</h4>
            <ul>
              {system.title === 'ICD-11' ? (
                <>
                  <li>Global standard for health reporting</li>
                  <li>Comprehensive disease classification</li>
                  <li>Digital-ready structure</li>
                  <li>Integration with traditional medicine systems</li>
                </>
              ) : (
                <>
                  <li>Holistic approach to wellness</li>
                  <li>Natural and minimal side effects</li>
                  <li>Personalized treatments based on individual constitution</li>
                  <li>Focus on prevention and health maintenance</li>
                </>
              )}
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Details Page Component
const DetailsPage = () => {
  const location = useLocation();
  const { item, system } = location.state || {};
  
  if (!item) {
    return (
      <div className="details-page">
        <div className="container">
          <div className="error-message">
            <h2>No Item Details Available</h2>
            <p>Please go back and select an item to view details.</p>
            <Link to="/search" className="back-button">Back to Search</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="details-page">
      <div className="container">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Link to={-1} className="back-button">← Back</Link>
          
          <div className="details-header">
            <h2>{item.english_name || item.display_name || item.title}</h2>
            <div className="badges">
              {system && <span className="system-badge">{system}</span>}
              {item.code && <span className="code-badge">{item.code}</span>}
            </div>
          </div>
          
          <div className="details-content">
            <div className="details-card">
              <h3>Basic Information</h3>
              <div className="details-grid">
                {item.code && (
                  <div className="detail-item">
                    <span className="detail-label">Code:</span>
                    <span className="detail-value">{item.code}</span>
                  </div>
                )}
                {item.english_name && (
                  <div className="detail-item">
                    <span className="detail-label">English Name:</span>
                    <span className="detail-value">{item.english_name}</span>
                  </div>
                )}
                {item.hindi_name && (
                  <div className="detail-item">
                    <span className="detail-label">Hindi Name:</span>
                    <span className="detail-value">{item.hindi_name}</span>
                  </div>
                )}
                {item.arabic_name && (
                  <div className="detail-item">
                    <span className="detail-label">Arabic Name:</span>
                    <span className="detail-value">{item.arabic_name}</span>
                  </div>
                )}
                {item.tamil_name && (
                  <div className="detail-item">
                    <span className="detail-label">Tamil Name:</span>
                    <span className="detail-value">{item.tamil_name}</span>
                  </div>
                )}
                {item.diacritical_name && (
                  <div className="detail-item">
                    <span className="detail-label">Diacritical Name:</span>
                    <span className="detail-value">{item.diacritical_name}</span>
                  </div>
                )}
                {item.romanized_name && (
                  <div className="detail-item">
                    <span className="detail-label">Romanized Name:</span>
                    <span className="detail-value">{item.romanized_name}</span>
                  </div>
                )}
                {item.display_name && (
                  <div className="detail-item">
                    <span className="detail-label">Display Name:</span>
                    <span className="detail-value">{item.display_name}</span>
                  </div>
                )}
                {item.title && (
                  <div className="detail-item">
                    <span className="detail-label">Title:</span>
                    <span className="detail-value">{item.title}</span>
                  </div>
                )}
              </div>
            </div>
            
            {item.description && item.description !== '-' && (
              <div className="details-card">
                <h3>Description</h3>
                <p>{item.description}</p>
              </div>
            )}
            
            {/* ICD-11 Specific Fields */}
            {(item.foundation_uri || item.linearization_uri || item.chapter_no || item.is_leaf !== undefined) && (
              <div className="details-card">
                <h3>ICD-11 Details</h3>
                <div className="details-grid">
                  {item.foundation_uri && (
                    <div className="detail-item">
                      <span className="detail-label">Foundation URI:</span>
                      <span className="detail-value">
                        <a href={item.foundation_uri} target="_blank" rel="noopener noreferrer">
                          {item.foundation_uri}
                        </a>
                      </span>
                    </div>
                  )}
                  {item.linearization_uri && (
                    <div className="detail-item">
                      <span className="detail-label">Linearization URI:</span>
                      <span className="detail-value">
                        <a href={item.linearization_uri} target="_blank" rel="noopener noreferrer">
                          {item.linearization_uri}
                        </a>
                      </span>
                    </div>
                  )}
                  {item.chapter_no && (
                    <div className="detail-item">
                      <span className="detail-label">Chapter Number:</span>
                      <span className="detail-value">{item.chapter_no}</span>
                    </div>
                  )}
                  {item.browser_link && (
                    <div className="detail-item">
                      <span className="detail-label">Browser Link:</span>
                      <span className="detail-value">
                        <a href={item.browser_link} target="_blank" rel="noopener noreferrer">
                          {item.browser_link}
                        </a>
                      </span>
                    </div>
                  )}
                  {item.icat_link && (
                    <div className="detail-item">
                      <span className="detail-label">ICAT Link:</span>
                      <span className="detail-value">
                        <a href={item.icat_link} target="_blank" rel="noopener noreferrer">
                          {item.icat_link}
                        </a>
                      </span>
                    </div>
                  )}
                  {item.is_leaf !== undefined && (
                    <div className="detail-item">
                      <span className="detail-label">Is Leaf:</span>
                      <span className={`detail-value status ${item.is_leaf ? 'active' : 'inactive'}`}>
                        {item.is_leaf ? 'Yes' : 'No'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Mapping Details Page Component (new)
const MappingDetailsPage = () => {
  const location = useLocation();
  const { mapping } = location.state || {};
  
  if (!mapping) {
    return (
      <div className="mapping-details-page">
        <div className="container">
          <div className="error-message">
            <h2>No Mapping Details Available</h2>
            <p>Please go back and select a mapping to view details.</p>
            <Link to="/search" className="back-button">Back to Search</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mapping-details-page">
      <div className="container">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Link to={-1} className="back-button">← Back to Results</Link>
          
          <div className="details-header">
            <h2>{mapping.source_term.english_name}</h2>
            <div className="badges">
              <span className="system-badge">{mapping.search_system}</span>
              <span className="code-badge">{mapping.source_term.code}</span>
              <span className="confidence-badge">
                Confidence: {(mapping.confidence_score * 100).toFixed(1)}%
              </span>
            </div>
          </div>
          
          <div className="mapping-details-content">
            <div className="details-section">
              <h3>Source Term Information</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">System:</span>
                  <span className="detail-value">{mapping.search_system}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Code:</span>
                  <span className="detail-value">{mapping.source_term.code}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">English Name:</span>
                  <span className="detail-value">{mapping.source_term.english_name}</span>
                </div>
                {mapping.source_term.hindi_name && (
                  <div className="detail-item">
                    <span className="detail-label">Hindi Name:</span>
                    <span className="detail-value">{mapping.source_term.hindi_name}</span>
                  </div>
                )}
                {mapping.source_term.diacritical_name && (
                  <div className="detail-item">
                    <span className="detail-label">Diacritical Name:</span>
                    <span className="detail-value">{mapping.source_term.diacritical_name}</span>
                  </div>
                )}
                {mapping.source_term.description && mapping.source_term.description !== '-' && (
                  <div className="detail-item full-width">
                    <span className="detail-label">Description:</span>
                    <span className="detail-value">{mapping.source_term.description}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="details-section">
              <h3>NAMASTE Terms Mapping</h3>
              <div className="mapping-cards">
                {mapping.namaste_terms.ayurveda && (
                  <div className="mapping-card">
                    <h4>Ayurveda</h4>
                    <div className="mapping-details">
                      <div className="detail-item">
                        <span className="detail-label">Code:</span>
                        <span className="detail-value">{mapping.namaste_terms.ayurveda.code}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">English Name:</span>
                        <span className="detail-value">{mapping.namaste_terms.ayurveda.english_name}</span>
                      </div>
                      {mapping.namaste_terms.ayurveda.hindi_name && (
                        <div className="detail-item">
                          <span className="detail-label">Hindi Name:</span>
                          <span className="detail-value">{mapping.namaste_terms.ayurveda.hindi_name}</span>
                        </div>
                      )}
                      {mapping.namaste_terms.ayurveda.diacritical_name && (
                        <div className="detail-item">
                          <span className="detail-label">Diacritical Name:</span>
                          <span className="detail-value">{mapping.namaste_terms.ayurveda.diacritical_name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {mapping.namaste_terms.siddha && (
                  <div className="mapping-card">
                    <h4>Siddha</h4>
                    <div className="mapping-details">
                      <div className="detail-item">
                        <span className="detail-label">Code:</span>
                        <span className="detail-value">{mapping.namaste_terms.siddha.code}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">English Name:</span>
                        <span className="detail-value">{mapping.namaste_terms.siddha.english_name}</span>
                      </div>
                      {mapping.namaste_terms.siddha.tamil_name && (
                        <div className="detail-item">
                          <span className="detail-label">Tamil Name:</span>
                          <span className="detail-value">{mapping.namaste_terms.siddha.tamil_name}</span>
                        </div>
                      )}
                      {mapping.namaste_terms.siddha.romanized_name && (
                        <div className="detail-item">
                          <span className="detail-label">Romanized Name:</span>
                          <span className="detail-value">{mapping.namaste_terms.siddha.romanized_name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {mapping.namaste_terms.unani && (
                  <div className="mapping-card">
                    <h4>Unani</h4>
                    <div className="mapping-details">
                      <div className="detail-item">
                        <span className="detail-label">Code:</span>
                        <span className="detail-value">{mapping.namaste_terms.unani.code}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">English Name:</span>
                        <span className="detail-value">{mapping.namaste_terms.unani.english_name}</span>
                      </div>
                      {mapping.namaste_terms.unani.arabic_name && (
                        <div className="detail-item">
                          <span className="detail-label">Arabic Name:</span>
                          <span className="detail-value">{mapping.namaste_terms.unani.arabic_name}</span>
                        </div>
                      )}
                      {mapping.namaste_terms.unani.romanized_name && (
                        <div className="detail-item">
                          <span className="detail-label">Romanized Name:</span>
                          <span className="detail-value">{mapping.namaste_terms.unani.romanized_name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {mapping.icd_mapping && (
              <div className="details-section">
                <h3>ICD-11 Mapping</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Code:</span>
                    <span className="detail-value">{mapping.icd_mapping.code}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Title:</span>
                    <span className="detail-value">{mapping.icd_mapping.title}</span>
                  </div>
                  {mapping.icd_mapping.foundation_uri && (
                    <div className="detail-item">
                      <span className="detail-label">Foundation URI:</span>
                      <span className="detail-value">
                        <a href={mapping.icd_mapping.foundation_uri} target="_blank" rel="noopener noreferrer">
                          {mapping.icd_mapping.foundation_uri}
                        </a>
                      </span>
                    </div>
                  )}
                  {mapping.icd_mapping.chapter_no && (
                    <div className="detail-item">
                      <span className="detail-label">Chapter Number:</span>
                      <span className="detail-value">{mapping.icd_mapping.chapter_no}</span>
                    </div>
                  )}
                  <div className="detail-item">
                    <span className="detail-label">Similarity Score:</span>
                    <span className="detail-value">{(mapping.icd_mapping.similarity_score * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="details-section">
              <h3>Additional Information</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Mapping ID:</span>
                  <span className="detail-value">{mapping.mapping_id}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Fuzzy Similarity:</span>
                  <span className="detail-value">{(mapping.fuzzy_similarity * 100).toFixed(1)}%</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Confidence Score:</span>
                  <span className="detail-value">{(mapping.confidence_score * 100).toFixed(1)}%</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Created At:</span>
                  <span className="detail-value">
                    {new Date(mapping.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Footer Component
const Footer = () => {
  return (
    <motion.footer 
      className="footer"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>ICD-TM2 Platform</h3>
            <p>Bridging modern healthcare with traditional medicine knowledge systems.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/search">Search</Link></li>
              <li><Link to="/ayurveda">Ayurveda</Link></li>
              <li><Link to="/siddha">Siddha</Link></li>
              <li><Link to="/unani">Unani</Link></li>
              <li><Link to="/icd11">ICD-11</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <p>Email: info@icd-tm2.org</p>
            <p>Phone: +91 9876543210</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2023 ICD-TM2 API Integration Platform. All rights reserved.</p>
        </div>
      </div>
    </motion.footer>
  );
};

// Main App Component
function App() {
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  useEffect(() => {
    // Set initial theme based on system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
    
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        // Fetch user profile data
        fetchUserProfile(user.uid);
      } else {
        setUserProfile(null);
      }
    });
    
    return unsubscribe;
  }, []);

  const fetchUserProfile = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        setUserProfile(userDoc.data());
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleSignIn = () => {
    setAuthMode('login');
    setAuthModalOpen(true);
  };

  const handleEmailAuth = async (email, password, name, mode) => {
    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        // Update profile with name
        await updateProfile(result.user, {
          displayName: name
        });
        // Create user document in Firestore
        await setDoc(doc(db, 'users', result.user.uid), {
          name: name,
          email: email,
          createdAt: serverTimestamp()
        });
      }
    } catch (error) {
      throw error;
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // Check if user document exists, if not create one
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', result.user.uid), {
          name: result.user.displayName,
          email: result.user.email,
          photoURL: result.user.photoURL,
          createdAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const handleSignOut = () => {
    signOut(auth);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const switchAuthMode = (mode) => {
    setAuthMode(mode);
  };

  return (
    <Router>
      <div className={`App ${theme}`}>
        <Header 
          theme={theme} 
          toggleTheme={toggleTheme} 
          user={user} 
          handleSignIn={handleSignIn} 
          handleSignOut={handleSignOut} 
        />
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/ayurveda" element={<SystemPage systemName="ayurveda" />} />
            <Route path="/siddha" element={<SystemPage systemName="siddha" />} />
            <Route path="/unani" element={<SystemPage systemName="unani" />} />
            <Route path="/icd11" element={<SystemPage systemName="icd11" />} />
            <Route path="/details" element={<DetailsPage />} />
            <Route path="/mapping-details" element={<MappingDetailsPage />} />
            <Route path="/profile" element={<ProfilePage user={user} />} />
            <Route path="/add-patient" element={<PatientForm />} />
            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          </Routes>
        </main>
        <Footer />
        
        <AuthModal 
          isOpen={authModalOpen}
          onClose={closeAuthModal}
          onSwitchMode={switchAuthMode}
          authMode={authMode}
          onAuth={handleEmailAuth}
        />
      </div>
    </Router>
  );
}

export default App;
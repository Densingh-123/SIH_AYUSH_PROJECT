import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
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
            {user ? (
              <li>
                <motion.button 
                  onClick={handleSignOut} 
                  className="auth-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign Out
                </motion.button>
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

// Search Page Component
const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    
    try {
      // Call the common endpoint
      const data = await fetchData(`${API_BASE_URL}/terminologies/search/?q=${searchTerm}`);
      
      if (data && data.results) {
        setResults(data.results);
        console.log("API Response:", data);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
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
          Find Traditional Medicine Treatments
        </motion.h2>
        <motion.form 
          onSubmit={handleSearch} 
          className="search-form"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <input
            type="text"
            placeholder="Search by symptom or condition (e.g., fever, diabetes)"
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
              <p>No results found for "{searchTerm}". Try searching for "fever" or "diabetes".</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {results && results.length > 0 && (
            <motion.div 
              className="search-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3>Results for "{searchTerm}"</h3>
              <div className="unified-results">
                <motion.div className="results-grid">
                  {results.map((item, index) => (
                    <SystemCard 
                      key={index} 
                      item={item} 
                      system="Common"
                    />
                  ))}
                </motion.div>
              </div>
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

  useEffect(() => {
    // Set initial theme based on system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
    
    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    
    return unsubscribe;
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  const handleSignOut = () => {
    signOut(auth);
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
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
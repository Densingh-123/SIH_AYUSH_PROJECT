ICD-TM2 API Integration Platform
<div align="center">
https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react
https://img.shields.io/badge/Firebase-Authentication-orange?style=for-the-badge&logo=firebase
https://img.shields.io/badge/Framer-Motion-purple?style=for-the-badge
https://img.shields.io/badge/Design-Responsive-green?style=for-the-badge

A modern web application that bridges modern EHR systems with traditional medicine knowledge from Ayurveda, Siddha, and Unani systems.

Live Demo • Report Bug • Request Feature

</div>
https://via.placeholder.com/800x400/4CAF50/FFFFFF?text=ICD-TM2+Platform+Screenshot

✨ Features
🔍 Unified Search across multiple traditional medicine systems

🌙 Dark/Light Theme with smooth transitions

📱 Fully Responsive design for all devices

⚡ Modern Animations powered by Framer Motion

🔐 Google Authentication with Firebase

🏥 Traditional Medicine Systems (Ayurveda, Siddha, Unani)

📊 ICD Code Integration for standardized reference

🚀 Quick Start
Prerequisites
Node.js (v14 or higher)

npm or yarn

Firebase account

Installation
Clone the repository:

bash
git clone https://github.com/your-username/icd-tm2-platform.git
cd icd-tm2-platform
Install dependencies:

bash
npm install
Set up Firebase:

Create a new Firebase project

Enable Google authentication

Replace the Firebase config in App.js with your own

Start the development server:

bash
npm start
Open http://localhost:3000 to view it in the browser.

🏗️ Project Structure
text
src/
├── components/          # Reusable components
│   ├── Header.js       # Navigation header
│   ├── HeroSection.js  # Hero section with animations
│   ├── ValueProposition.js # Value proposition section
│   └── Features.js     # Features showcase
├── pages/              # Page components
│   ├── LandingPage.js  # Home page
│   ├── SearchPage.js   # Search functionality
│   └── SystemPage.js   # Individual system pages
├── App.js              # Main application component
├── App.css             # Application styles
└── index.js            # Application entry point
🎨 Design System
The application uses a custom design system with CSS variables for consistent theming:

css
:root {
  --primary-color: #4CAF50;
  --secondary-color: #2196F3;
  --accent-color: #FF9800;
  --text-color: #333;
  --bg-color: #f9f9f9;
  --card-bg: #ffffff;
  --header-bg: #ffffff;
  --footer-bg: #2c3e50;
  --footer-text: #ecf0f1;
  --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  --transition: all 0.3s ease;
}
Dark mode variants are automatically applied when the theme is toggled.

🔧 Technologies Used
React - Frontend framework

React Router - Navigation

Framer Motion - Animations

Firebase - Authentication

CSS3 - Styling with custom properties

GSAP - Additional animations

📱 Usage
Searching for Treatments
Navigate to the Search page

Enter a symptom or condition (e.g., "fever", "diabetes")

View results from all traditional medicine systems

Filter by specific system if needed

Exploring Traditional Systems
Ayurveda: Ancient Indian system of natural healing

Siddha: Traditional Tamil system of medicine

Unani: Greco-Arabic system of medicine

Each system page provides detailed information about the tradition and its treatments.

🎭 Animation System
The application uses a sophisticated animation system with:

Page transitions with fade and slide effects

Staggered animations for lists and grids

Hover effects on interactive elements

Scroll-triggered animations for content sections

Loading states with spinners and transitions

🌙 Dark Mode
The application features a complete dark mode implementation that:

Toggles with a smooth animation

Preserves user preference

Adjusts all UI elements appropriately

Maintains readability and contrast

🔌 API Integration
The platform is designed to integrate with the ICD-TM2 API, providing:

Standardized ICD codes for traditional medicine

Cross-system search capabilities

Structured response formats

🤝 Contributing
We welcome contributions to the ICD-TM2 platform! Please follow these steps:

Fork the project

Create a feature branch (git checkout -b feature/amazing-feature)

Commit your changes (git commit -m 'Add some amazing feature')

Push to the branch (git push origin feature/amazing-feature)

Open a Pull Request

📄 License
This project is licensed under the MIT License - see the LICENSE.md file for details.

📞 Contact
For questions or support, please contact:

Email: info@icd-tm2.org

Phone: +91 9876543210

🙏 Acknowledgments
Ministry of AYUSH, Government of India

World Health Organization for ICD standards

Traditional medicine practitioners and researchers

<div align="center">
Made with ❤️ for the future of integrative healthcare

</div>

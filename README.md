# VibeAtlas

![home-page.png](screenshots/main.png)
![popular-destinations.png](screenshots/popular-destinations.png)

**VibeAtlas** is a smart travel companion that uses user-selected preferences and AI to generate curated destination suggestions — built for people who want to vibe, not search.

## Table of Contents

- [About The Project](#about-the-project)
- [Core Features](#core-features)
- [Built With / Tech Stack](#built-with--tech-stack)
- [Prerequisites / Dependencies](#prerequisites--dependencies)
- [How to Run](#how-to-run)
- [License](#license)
- [Contact](#contact)

---

## About The Project

Traveling? Looking for something fun to do?  
Get AI-powered personalised suggestions for places to visit: from buzzing city nights to hidden paradise escapes, VibeAtlas serves up instant recommendations that match your energy.

It’s free, effortless, and actually understands your style. Whether you’re feeling city lights, beach waves, or something off the grid, we’ve got you.

---

## Core Features

- Multi-step, card-based onboarding survey for personalization
- AI-powered destination recommendation engine
- Google login and secure Firebase authentication
- Modern, clean frontend using React, MUI, and React Bits
- RESTful API backend built with Express.js
- Data stored in a MySQL database
- Uses multiple external APIs for location and event data
- Environment-configurable via `.env` file

---

## Built With / Tech Stack

## 🖥️ Frontend

- [![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=white&style=for-the-badge)](https://react.dev/)
- [![MUI](https://img.shields.io/badge/MUI-007FFF?logo=mui&logoColor=white&style=for-the-badge)](https://mui.com/)
- [![React Bits](https://img.shields.io/badge/React%20Bits-Informational?style=for-the-badge)](https://github.com/vasanthk/react-bits)

---

## 🛠️ Backend

- [![Express.js](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white&style=for-the-badge)](https://expressjs.com/)
- [![Firebase Auth](https://img.shields.io/badge/Firebase%20Auth-FFCA28?logo=firebase&logoColor=black&style=for-the-badge)](https://firebase.google.com/products/auth)
- [![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white&style=for-the-badge)](https://www.mysql.com/)

---

## 🌐 APIs Used

- [![Gemini API](https://img.shields.io/badge/Gemini%20API-4285F4?logo=google&logoColor=white&style=for-the-badge)](https://deepmind.google/technologies/gemini/)
- [![Ticketmaster API](https://img.shields.io/badge/Ticketmaster%20API-003366?style=for-the-badge)](https://developer.ticketmaster.com/products-and-docs/apis/getting-started/)
- [![RapidAPI](https://img.shields.io/badge/RapidAPI-000000?logo=rapidapi&logoColor=white&style=for-the-badge)](https://rapidapi.com/)
- [![GeoNames](https://img.shields.io/badge/GeoNames-Informational?style=for-the-badge)](https://www.geonames.org/export/web-services.html)
- [![OpenCage Geocoding](https://img.shields.io/badge/OpenCage%20Geocoding-3A6EAD?style=for-the-badge)](https://opencagedata.com/api)
---

## Prerequisites / Dependencies

- Node.js (v18 or higher recommended)
- npm or yarn
- MySQL server running locally or remotely
- Firebase project with enabled auth providers (email & Google)
- API keys for all external services listed in `.env`

---

## How to Run
```bash
1. Clone the repository

git clone https://github.com/your-username/vibeatlas.git
cd vibeatlas


2. Install dependencies 
# Frontend
cd client
npm install

# Backend
cd ../server
npm install

3. Set up environment variables
# From project root
cp server/.env.example server/.env
#Then open server/.env and fill in your API credentials.
```

## License

This project is open-source. License details coming soon.

## Contact
- Email: ghazali.raydan@gmail.com
- GitHub: github.com/iamrayghazali

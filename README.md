# AttendIQ

AttendIQ is a web app that helps teams understand real attention during online meetings in a privacy safe way.
It measures focus using browser level signals instead of cameras or screen recording.

No webcam
No audio access
No invasive tracking

# Problem

Remote meetings are common, but attention is hard to measure.

* Most teams track:

* Who joined the meeting

* They do not know:

* Who actually stayed focused

Many existing tools use webcams or screen recording, which breaks trust.

# Solution

AttendIQ measures meeting focus using simple browser signals such as:

* Tab active or inactive

* Window focus and blur

* Idle time

At the end of a meeting, it generates a clear focus report.

# Features

* Create meeting sessions

* Join meetings through a browser link

* Track attention without spying

* Focus score for each participant

* Clean and professional UI

# Tech Stack

# Frontend

-> React
-> Tailwind CSS

# Backend

-> Node.js
-> Express
-> Auth and Database
-> Supabase

# Browser APIs

-> Page Visibility API
-> Window focus and blur events
-> Idle time detection

# AI Assisted Development

-> Google Antigravity AI code editor
-> Used to speed up development.
-> All generated code was reviewed and edited manually.

# Prerequisites

Make sure you have the following installed:

Node.js (v18 or later)
npm or yarn
Git

# Setup Instructions

1. Clone the repository
git clone https://github.com/your-username/AttendIQ.git
cd AttendIQ

2. Backend setup
cd server
npm install

3. Create a .env file inside the server folder.

generate an SUPABASE_URL and SUPABASE_KEY from your account and use paste it inside .env folder.

SUPABASE_URL = your_supabse_url
SUPABASE_KEY = your_supabase_key

4. Start the backend server:

npm run dev

Backend runs on:

http://localhost:5000

5. Frontend setup

Open a new terminal window.

cd client
npm install

Start the frontend:

npm run dev

Frontend runs on:

http://localhost:5173

# Focus Score Logic

Focus score is calculated based on active attention time.

Example formula:

Focus Score = (Active Time / Total Time) × 100

# Privacy

AttendIQ is built with privacy first principles.

It does not:

-> Use webcam

-> Record screen

-> Capture audio

-> Read page content

Only browser state signals are used.

# Future Improvements

-> Team level analytics

-> Calendar integration

-> Downloadable reports

-> Custom focus rules

-> Company level dashboards

# Original Work

AttendIQ was built during Nexora Hacks 2026.
All code was written during the hackathon period.

# License

This project is for hackathon and demo purposes.



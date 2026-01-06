# Frontend Setup Instructions

## Step 1: Install Node.js

Make sure you have Node.js installed (version 14 or higher):
```bash
node --version
npm --version
```

If not installed, download from: https://nodejs.org/

## Step 2: Install Dependencies

```bash
# Navigate to frontend folder
cd frontend

# Install all dependencies
npm install
```

This will install:
- React
- React Router
- Firebase
- Axios

## Step 3: Configure Firebase

1. Open `src/services/firebase.js`
2. Replace the Firebase config with YOUR config from Firebase Console

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

**Where to find this?**
- Go to Firebase Console → Project Settings → Your apps → Web app
- Copy the config object

## Step 4: Start the Development Server

```bash
npm start
```

The app will open at: **http://localhost:3000**

## Step 5: Login with Demo Accounts

After setting up backend and creating demo users, you can login with:

**Student Account:**
- Email: student@test.com
- Password: password123

**Teacher Account:**
- Email: teacher@test.com
- Password: password123

**Parent Account:**
- Email: parent@test.com
- Password: password123

## Troubleshooting

### Error: "npm command not found"
- Install Node.js from https://nodejs.org/

### Error: "Cannot find module"
- Delete `node_modules` folder
- Run `npm install` again

### Firebase Connection Error
- Double-check your Firebase config in `src/services/firebase.js`
- Make sure Firebase Authentication is enabled in Firebase Console

### Backend Connection Error
- Make sure backend is running on http://localhost:8000
- Check `src/services/api.js` has correct API_URL

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/        # Reusable components
│   ├── pages/            # All page components
│   │   ├── student/
│   │   ├── teacher/
│   │   └── parent/
│   ├── services/         # API & Firebase config
│   ├── App.jsx           # Main routing
│   ├── index.js          # Entry point
│   └── index.css         # Global styles
└── package.json
```

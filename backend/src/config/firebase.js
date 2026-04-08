const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

try {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Safely parse the private key, converting escaped newlines
      privateKey: process.env.FIREBASE_PRIVATE_KEY
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        : undefined,
    }),
  });
  console.log('Firebase Admin SDK Initialized Successfully');
} catch (error) {
  console.error('Firebase Admin Initialization Error (Check .env configuration):', error.message);
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };

const { db } = require('../config/firebase');

const getProfile = async (req, res) => {
  try {
    const uid = req.user.uid;
    // Assuming user data is stored in the 'users' collection in Firestore
    const userRef = db.collection('users').doc(uid);
    const doc = await userRef.get();

    if (!doc.exists) {
        return res.status(404).json({ message: 'User profile not found in database' });
    }

    res.status(200).json({ user: doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getProfile };

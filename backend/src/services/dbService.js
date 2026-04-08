const { db } = require('../config/firebase');

/**
 * Persists a new parsed transaction into the user's Firestore collection.
 */
const saveTransaction = async (userId, transactionData) => {
  try {
    const transactionsRef = db.collection('users').doc(userId).collection('transactions');
    
    // Default system timestamps
    const payload = {
      ...transactionData,
      createdAt: new Date().toISOString(),
    };

    const newDoc = await transactionsRef.add(payload);
    
    return {
      id: newDoc.id,
      ...payload
    };
  } catch (error) {
    throw new Error(`Failed to save transaction: ${error.message}`);
  }
};

/**
 * Retrieves a user's transactions order by creation date.
 */
const getUserTransactions = async (userId, limit = 50) => {
  try {
    const snapshot = await db.collection('users')
      .doc(userId)
      .collection('transactions')
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();
      
    if (snapshot.empty) return [];

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    throw new Error(`Failed to retrieve transactions: ${error.message}`);
  }
};

module.exports = {
  saveTransaction,
  getUserTransactions
};

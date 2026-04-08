const { parseBankSMS, parseBankSMSWithAI } = require('../services/smsParserService');
const { parseCSV, parsePDF } = require('../services/statementParserService');
const { saveTransaction, getUserTransactions } = require('../services/dbService');

const parseSMS = async (req, res, next) => {
  try {
    const { smsContent, sender, useAI = false } = req.body;
    
    if (!smsContent) {
      return res.status(400).json({ error: 'SMS content is required' });
    }

    // Call Regex or AI logic based on client preference/settings
    const parsedData = useAI 
      ? await parseBankSMSWithAI(smsContent) 
      : parseBankSMS(smsContent);

    if (!parsedData.isTransaction) {
      return res.status(200).json({ 
        source: "sms",
        result: { message: "Ignored: Not a transactional SMS" }
      });
    }

    // Usually we would immediately save this to the DB, but we 
    // leave room for a UI confirmation step before strictly calling saveTransaction.
    return res.status(200).json({ 
      source: "sms",
      result: parsedData 
    });

  } catch (error) {
    next(error); // Push to central error middleware
  }
};

const parseStatement = async (req, res, next) => {
  try {
    // req.file will contain the uploaded file (via multer middleware)
    if (!req.file) {
      return res.status(400).json({ error: 'No statement file uploaded' });
    }

    const { mimetype, originalname, buffer } = req.file;
    let parsedTransactions = [];

    // Route processing based on file type
    if (mimetype === 'text/csv' || originalname.endsWith('.csv')) {
      parsedTransactions = await parseCSV(buffer);
    } else if (mimetype === 'application/pdf' || originalname.endsWith('.pdf')) {
      parsedTransactions = await parsePDF(buffer);
    } else {
      return res.status(400).json({ error: 'Unsupported file type. Please upload a CSV or PDF.' });
    }
    
    res.status(200).json({
      message: `Successfully processed statement: ${originalname}`,
      type: mimetype,
      count: parsedTransactions.length,
      parsedTransactions
    });

  } catch (error) {
    next(error); 
  }
};

// -- Added Endpoints for Saving/Loading DB Transactions --

const saveParsedTransaction = async (req, res, next) => {
  try {
    // Ensure the token middleware populated req.user
    const userId = req.user?.uid; 
    if (!userId) return res.status(401).json({ error: 'Unauthorized save attempt' });

    const transactionData = req.body;
    
    const savedRecord = await saveTransaction(userId, transactionData);
    
    return res.status(201).json({
      message: 'Transaction saved to ledger securely',
      transaction: savedRecord
    });
  } catch (error) {
    next(error);
  }
};

const fetchUserTransactions = async (req, res, next) => {
  try {
    const userId = req.user?.uid;
    if (!userId) return res.status(401).json({ error: 'Unauthorized to fetch ledger' });

    const pageSize = req.query.limit ? parseInt(req.query.limit) : 50;
    const history = await getUserTransactions(userId, pageSize);
    
    return res.status(200).json(history);
  } catch (error) {
    next(error);
  }
};

module.exports = { parseSMS, parseStatement, saveParsedTransaction, fetchUserTransactions };

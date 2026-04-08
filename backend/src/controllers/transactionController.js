const { parseBankSMS, parseBankSMSWithAI } = require('../services/smsParserService');
const { parseCSV, parsePDF } = require('../services/statementParserService');

const parseSMS = async (req, res) => {
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

    return res.status(200).json({ 
      source: "sms",
      result: parsedData 
    });

  } catch (error) {
    console.error('Error parsing SMS:', error.message);
    res.status(500).json({ error: error.message });
  }
};

const parseStatement = async (req, res) => {
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
    console.error('Error parsing Statement file:', error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { parseSMS, parseStatement };

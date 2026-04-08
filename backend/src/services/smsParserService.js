/**
 * Basic Regex-based SMS Parser 
 * This service will try to extract key financial information from bank SMS messages.
 */

const parseBankSMS = (smsContent) => {
  if (!smsContent || typeof smsContent !== 'string') {
    throw new Error('Invalid SMS content');
  }

  const result = {
    isTransaction: false,
    amount: null,
    currency: null,
    merchant: null,
    type: null,
    accountInfo: null,
    date: new Date().toISOString() // Fallback to current date
  };

  // 1. Detect if it's a transaction (debit or credit)
  const debitRegex = /(?:debited|spent|paid|deducted|withdrawn)/i;
  const creditRegex = /(?:credited|received|added|deposited)/i;

  if (debitRegex.test(smsContent)) {
    result.isTransaction = true;
    result.type = 'Debit';
  } else if (creditRegex.test(smsContent)) {
    result.isTransaction = true;
    result.type = 'Credit';
  }

  // If not a transaction, abort parsing early
  if (!result.isTransaction) return result;

  // 2. Extract Amount and Currency
  // Matches something like $45.99, USD 45.99, Rs. 1000, INR 500
  const amountRegex = /(?:USD|INR|EUR|GBP|Rs\.?|\$|€|£)\s*([0-9,]+\.?[0-9]*)/i;
  const currencyRegex = /(USD|INR|EUR|GBP|Rs\.?|\$|€|£)/i;

  const amountMatch = smsContent.match(amountRegex);
  const currencyMatch = smsContent.match(currencyRegex);

  if (amountMatch) {
    result.amount = parseFloat(amountMatch[1].replace(/,/g, ''));
  }
  
  if (currencyMatch) {
    // Normalize basic currency signs
    let curr = currencyMatch[1].toUpperCase();
    if (curr.includes('RS')) curr = 'INR';
    if (curr === '$') curr = 'USD';
    if (curr === '€') curr = 'EUR';
    if (curr === '£') curr = 'GBP';
    result.currency = curr;
  }

  // 3. Extract Merchant / Vendor (Simplistic approach: looks for 'at' or 'to')
  const merchantRegex = /(?:at|to)\s+([A-Za-z0-9\s*&]+?)(?:\s+on|\.|$)/i;
  const merchantMatch = smsContent.match(merchantRegex);
  
  if (merchantMatch) {
    result.merchant = merchantMatch[1].trim();
  } else {
    result.merchant = 'Unknown Merchant';
  }

  // 4. Extract Account Information (e.g., A/c ...1234 or card ending 1234)
  const accountRegex = /(?:a\/c|account|card).*?([0-9]{3,4})(?!\d)/i;
  const accountMatch = smsContent.match(accountRegex);
  
  if (accountMatch) {
    result.accountInfo = `***${accountMatch[1]}`;
  }

  return result;
};

/**
 * Alternative: Groq-based parsing for complex SMS 
 * (Uses Groq API to extract structured JSON data)
 */
const Groq = require('groq-sdk');

const parseBankSMSWithAI = async (smsContent) => {
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    
    // We enforce a strict JSON output schema so it seamlessly integrates with our app
    const prompt = `
      You are a financial API. You extract structured data from bank SMS messages.
      Analyze the following SMS and output ONLY a valid JSON object with the following schema:
      {
        "isTransaction": boolean (true if it's a debit or credit, false if promotional/auth code),
        "amount": number (the extracted amount, null if not found),
        "currency": string (3-letter currency code like USD, INR, GBP, null if not found),
        "merchant": string (the name of the vendor or sender, null if not found),
        "type": string ("Debit" or "Credit", null if not found),
        "accountInfo": string (e.g., "***1234", null if not found),
        "date": string (ISO 8601 format, use current time if none found)
      }
      
      SMS Content: "${smsContent}"
    `;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama3-8b-8192',
      response_format: { type: 'json_object' } // Guarantees JSON parsing
    });

    const parsedResponse = JSON.parse(completion.choices[0]?.message?.content);
    return parsedResponse;
    
  } catch (error) {
    console.error('Groq AI Parsing Error, falling back to Regex:', error.message);
    // Fallback to local regex method if API fails or rate limits
    return parseBankSMS(smsContent);
  }
};

module.exports = { parseBankSMS, parseBankSMSWithAI };

/**
 * Statement Parser Service
 * Handles processing of CSV and PDF files in memory to extract transactions.
 */
const csv = require('csv-parser');
const { Readable } = require('stream');
const pdfParse = require('pdf-parse');

/**
 * Parses a CSV buffer into an array of JSON objects.
 * Uses csv-parser and native stream pipelines.
 */
const parseCSV = (buffer) => {
  return new Promise((resolve, reject) => {
    const results = [];
    const stream = Readable.from(buffer); // Convert Buffer to Stream

    stream
      .pipe(csv())
      .on('data', (data) => {
        // Here we could implement robust mapping logic 
        // depending on the bank's column formats
        results.push(data);
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
};

/**
 * Parses a PDF buffer to extract text using pdf-parse.
 * Post-processes the extracted text to identify transaction rows.
 */
const parsePDF = async (buffer) => {
  try {
    const pdfData = await pdfParse(buffer);
    const text = pdfData.text;
    
    // Simplistic PDF parsing - usually needs customized regex based on the bank's layout.
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    
    const results = [];
    // Just a placeholder scanning logic. A robust solution needs date-centric line detection.
    for (const line of lines) {
      if (line.match(/[0-9]{2}[\/\-][0-9]{2}[\/\-][0-9]{4}/)) {
        // Line contains a date - likely a transaction
        results.push({ rawText: line });
      }
    }

    return results;
  } catch (error) {
    throw new Error(`Failed to parse PDF: ${error.message}`);
  }
};

module.exports = { parseCSV, parsePDF };
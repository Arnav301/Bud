const { parseBankSMS } = require('../../src/services/smsParserService');

describe('SMS Parser Service', () => {
  it('identifies a debit transaction and extracts amount, currency, and merchant', () => {
    const sms = 'Your a/c no. XXXXXX1234 is debited for Rs.500.00 on 12-05-26 and credited to Amazon. UPI Ref 123456.';
    const result = parseBankSMS(sms);

    expect(result.isTransaction).toBe(true);
    expect(result.type).toBe('Debit');
    expect(result.amount).toBe(500.00);
    expect(result.currency).toBe('INR'); // Rs should be parsed to INR
    expect(result.merchant).toBe('Amazon');
    expect(result.accountInfo).toBe('***1234');
  });

  it('identifies a credit transaction and extracts amount', () => {
    const sms = 'Rs 15,000.00 credited to a/c **4567 on 01-04-26 by HR Dept.';
    const result = parseBankSMS(sms);

    expect(result.isTransaction).toBe(true);
    expect(result.type).toBe('Credit');
    expect(result.amount).toBe(15000.00);
    expect(result.currency).toBe('INR');
    expect(result.accountInfo).toBe('***4567');
  });

  it('correctly maps USD format', () => {
    const sms = 'Spent $45.99 on Uber. Card ending 9999.';
    const result = parseBankSMS(sms);

    expect(result.isTransaction).toBe(true);
    expect(result.type).toBe('Debit');
    expect(result.amount).toBe(45.99);
    expect(result.currency).toBe('USD');
  });

  it('ignores non-transactional promotional SMS', () => {
    const sms = 'Get 50% off on your next purchase at MyStore. Click here to avail!';
    const result = parseBankSMS(sms);

    expect(result.isTransaction).toBe(false);
    expect(result.amount).toBeNull();
  });
});

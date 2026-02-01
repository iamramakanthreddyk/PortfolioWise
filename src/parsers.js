import Papa from 'papaparse';
import { parseEuroNumber, normalizeDate } from './utils.js';

export function parseCsv(content, forcedPlatform = 'auto') {
  const parsed = Papa.parse(content.trim(), { header: true, skipEmptyLines: true });
  const headers = parsed.meta.fields || [];
  const detected = detect(headers);
  const platform = forcedPlatform && forcedPlatform !== 'auto' ? forcedPlatform : detected;

  const rows = parsed.data.map((row) => normalizeRow(row, platform));
  return { platform, headers, rows };
}

function detect(headers) {
  const lower = headers.map((h) => h.toLowerCase());
  if (lower.includes('reference') && lower.includes('isin') && lower.includes('amount') && lower.includes('tax')) {
    return 'scalable';
  }
  return 'unknown';
}

function normalizeRow(row, platform) {
  if (platform === 'scalable') {
    return {
      date: normalizeDate(row.date),
      time: row.time || '',
      status: row.status || '',
      reference: row.reference || '',
      description: row.description || '',
      assetType: row.assetType || '',
      type: row.type || '',
      isin: row.isin || '',
      shares: parseEuroNumber(row.shares),
      price: parseEuroNumber(row.price),
      amount: parseEuroNumber(row.amount),
      fee: parseEuroNumber(row.fee),
      tax: parseEuroNumber(row.tax),
      currency: row.currency || 'EUR',
      raw: row
    };
  }
  // Fallback
  return {
    ...row,
    shares: parseEuroNumber(row.shares),
    price: parseEuroNumber(row.price),
    amount: parseEuroNumber(row.amount),
    fee: parseEuroNumber(row.fee),
    tax: parseEuroNumber(row.tax),
    currency: row.currency || 'EUR',
    raw: row
  };
}

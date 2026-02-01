// Simple EU number normalizer: turns "1.234,56" -> 1234.56
export function parseEuroNumber(value) {
  if (value === undefined || value === null) return 0;
  if (typeof value === 'number') return value;
  const cleaned = String(value).trim().replace(/\./g, '').replace(',', '.');
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

export function detectPlatform(headers) {
  const joined = headers.join(',').toLowerCase();
  if (joined.includes('scalable') || joined.includes('scal')) return 'scalable';
  if (joined.includes('invest') || joined.includes('trade')) return 'trade212';
  return 'unknown';
}

export function normalizeDate(dateStr) {
  // Expecting DD.MM.YYYY or YYYY-MM-DD or YYYY.MM.DD from broker CSVs
  if (!dateStr) return '';
  if (dateStr.includes('-')) return dateStr; // already ISO-ish
  const parts = dateStr.split('.');
  if (parts.length === 3) {
    const [d, m, y] = parts;
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }
  return dateStr;
}

export function paginate(items, page, pageSize) {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

export function formatCurrency(value) {
  return value.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

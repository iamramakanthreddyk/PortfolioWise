import { formatCurrency, normalizeDate } from './utils.js';

// Helper: infer exemption used from zero-tax sells
export function inferExemptionUsed(rows, isCouple = true) {
  const exemptionCap = isCouple ? 2000 : 1000;
  let used = 0;
  let remaining = exemptionCap;
  const sells = rows.filter((r) => (r.type || '').toLowerCase() === 'sell');
  for (const r of sells) {
    if ((r.tax ?? 0) === 0 && remaining > 0) {
      const gain = Math.max(0, r.amount ?? 0);
      const apply = Math.min(gain, remaining);
      used += apply;
      remaining -= apply;
    }
  }
  return used;
}

export function computeSummary(rows, options) {
  const {
    isCouple = true,
    exemptionAlreadyUsed = 0,
    includeChurchTax = false,
    brokerAppliedExemption = false,
    baseRatePercent = 25,
    solidarityPercent = 5
  } = options;

  const baseRate = (Number(baseRatePercent) || 0) / 100;
  const solidarityRate = baseRate * ((Number(solidarityPercent) || 0) / 100);
  const churchRate = includeChurchTax ? baseRate * 0.09 : 0; // 9% of tax by default
  const effectiveRate = baseRate + solidarityRate + churchRate;
  const exemption = isCouple ? 2000 : 1000;
  const exemptionRemaining = Math.max(0, exemption - exemptionAlreadyUsed);

  const typed = rows.map((row) => ({ ...row, _type: (row.type || '').toLowerCase() }));
  const sells = typed.filter((r) => r._type === 'sell');
  const buys = typed.filter((r) => r._type === 'buy');
  const deposits = typed.filter((r) => r._type === 'deposit');
  const withdrawals = typed.filter((r) => r._type === 'withdrawal');

  const totalTaxDeducted = sells.reduce((sum, r) => sum + (r.tax || 0), 0);
  const totalSellValue = sells.reduce((sum, r) => sum + (r.amount || 0), 0);
  const totalBuyValue = buys.reduce((sum, r) => sum + Math.abs(r.amount || 0), 0);
  const totalDeposits = deposits.reduce((sum, r) => sum + (r.amount || 0), 0);
  const totalWithdrawals = withdrawals.reduce((sum, r) => sum + Math.abs(r.amount || 0), 0);
  const netCashflow = rows.reduce((sum, r) => sum + (r.amount || 0), 0);

  const taxedSells = sells.filter((r) => !!r.tax);
  const positiveTaxCount = taxedSells.filter((r) => (r.tax || 0) > 0).length;
  const negativeTaxCount = taxedSells.filter((r) => (r.tax || 0) < 0).length;
  const largestTax = taxedSells.reduce((max, r) => Math.max(max, r.tax || 0), 0);
  const avgTax = taxedSells.length ? totalTaxDeducted / taxedSells.length : 0;

  const dateValues = rows
    .map((r) => normalizeDate(r.date || ''))
    .filter((d) => d && !Number.isNaN(Date.parse(d)))
    .sort();
  const earliestDate = dateValues[0] || '';
  const latestDate = dateValues[dateValues.length - 1] || '';

  // Estimate gains from tax deducted
  let gainsEstimated;
  if (brokerAppliedExemption) {
    gainsEstimated = (totalTaxDeducted / effectiveRate) + exemptionRemaining;
  } else {
    gainsEstimated = totalTaxDeducted / effectiveRate;
  }

  const taxableGains = Math.max(0, gainsEstimated - exemptionRemaining);
  const taxLiability = taxableGains * effectiveRate;
  const settlement = taxLiability - totalTaxDeducted;
  const exemptionAppliedNow = Math.min(gainsEstimated, exemptionRemaining);

  const rateBreakdown = `${baseRatePercent}% base + ${solidarityPercent}% soli${includeChurchTax ? ' + church' : ''}`;
  const derivation = brokerAppliedExemption
    ? `Broker flagged the allowance already. We therefore add €${formatCurrency(exemptionRemaining)} back before applying ${rateBreakdown}.`
    : `Tax column totals €${formatCurrency(totalTaxDeducted)}. Using ${rateBreakdown} (${(effectiveRate * 100).toFixed(includeChurchTax ? 3 : 1)}%) we reverse the math to gross gains of €${formatCurrency(gainsEstimated)} before exemptions.`;

  const csvFacts = {
    transactions: rows.length,
    sellCount: sells.length,
    buyCount: buys.length,
    totalSellValue,
    totalBuyValue,
    totalDeposits,
    totalWithdrawals,
    netCashflow,
    positiveTaxCount,
    negativeTaxCount,
    averageTaxPerSell: avgTax,
    largestSingleTax: largestTax,
    earliestDate,
    latestDate
  };

  return {
    effectiveRate,
    exemption,
    exemptionRemaining,
    exemptionAlreadyUsed,
    isCouple,
    includeChurchTax,
    brokerAppliedExemption,
    totalTaxDeducted,
    gainsEstimated,
    taxableGains,
    taxLiability,
    settlement,
    exemptionAppliedNow,
    derivation,
    csvFacts,
    baseRatePercent,
    solidarityPercent
  };
}

export function formatSummary(summary) {
  return {
    rate: `${(summary.effectiveRate * 100).toFixed(summary.includeChurchTax ? 3 : 1)}%`,
    totalTaxDeducted: `€ ${formatCurrency(summary.totalTaxDeducted)}`,
    gainsEstimated: `€ ${formatCurrency(summary.gainsEstimated)}`,
    taxableGains: `€ ${formatCurrency(summary.taxableGains)}`,
    taxLiability: `€ ${formatCurrency(summary.taxLiability)}`,
    settlement: summary.settlement < 0
      ? { label: 'Refund', value: `€ ${formatCurrency(Math.abs(summary.settlement))}` }
      : { label: 'Amount Owed', value: `€ ${formatCurrency(summary.settlement)}` }
  };
}

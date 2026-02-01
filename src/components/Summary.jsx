import React from 'react';
import { formatCurrency } from '../utils.js';

export function Summary({ summary }) {
  const settlementLabel = summary.settlement < 0 ? 'Estimated refund' : 'Estimated amount owed';
  const settlementValue = `€ ${formatCurrency(Math.abs(summary.settlement))}`;

  return (
    <div className="card summary-card">
      <div className="summary-head">
        <div>
          <div className="badge badge-soft">Live German assumptions</div>
          <h2>Tax Snapshot</h2>
          <p>
            {summary.brokerAppliedExemption
              ? 'Broker already applied the allowance; we add it back before comparing.'
              : 'Broker taxed the full gains; we apply the allowance ourselves.'}
          </p>
        </div>
        <div className="rate-pill">
          {(summary.effectiveRate * 100).toFixed(summary.includeChurchTax ? 3 : 1)}%
          <span>{summary.baseRatePercent}% base + {summary.solidarityPercent}% soli{summary.includeChurchTax ? ' + church' : ''}</span>
        </div>
      </div>

      <div className="summary-grid">
        <SummaryBox title="Tax withheld from CSV" value={`€ ${formatCurrency(summary.totalTaxDeducted)}`} subtitle={`${summary.csvFacts.positiveTaxCount} taxed sells`} />
        <SummaryBox title="Gross gains implied" value={`€ ${formatCurrency(summary.gainsEstimated)}`} subtitle={`Derived from tax ÷ rate`} />
        <SummaryBox title="Allowance applied now" value={`€ ${formatCurrency(summary.exemptionAppliedNow)}`} subtitle={`${summary.isCouple ? 'Couple' : 'Individual'} exemption`} />
        <SummaryBox title="Taxable gains" value={`€ ${formatCurrency(summary.taxableGains)}`} subtitle="After allowance" />
        <SummaryBox title="Tax liability" value={`€ ${formatCurrency(summary.taxLiability)}`} subtitle="What Finanzamt expects" />
        <SummaryBox title="Net gain after taxes" value={`€ ${formatCurrency(summary.gainsEstimated - summary.taxLiability)}`} subtitle="Profit after all taxes" />
        <SummaryBox title={settlementLabel} value={settlementValue} highlight />
      </div>
    </div>
  );
}

function SummaryBox({ title, value, subtitle, highlight }) {
  return (
    <div className={`summary-box ${highlight ? 'summary-box--highlight' : ''}`}>
      <div className="summary-title">{title}</div>
      <div className="summary-value">{value}</div>
      {subtitle && <div className="summary-subtitle">{subtitle}</div>}
    </div>
  );
}

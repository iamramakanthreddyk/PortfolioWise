import React from 'react';
import { formatCurrency } from '../utils.js';

export function Derivation({ summary }) {
  const facts = summary.csvFacts || {};

  return (
    <div className="card derivation-card">
      <div className="derivation-head">
        <div>
          <h2>What the CSV told us vs. what we derived</h2>
          <p>Use this section to cross-check how the withheld tax translates into gains under your assumptions.</p>
        </div>
        <div className="badge badge-outline">Transparent math</div>
      </div>

      <div className="derivation-grid">
        <div>
          <h3>Direct from CSV</h3>
          <ul>
            <li>Tax withheld: € {formatCurrency(summary.totalTaxDeducted)}</li>
            <li>Taxed sell orders: {facts.positiveTaxCount || 0}</li>
            <li>Average tax per sell: € {formatCurrency(facts.averageTaxPerSell || 0)}</li>
            <li>Largest single tax: € {formatCurrency(facts.largestSingleTax || 0)}</li>
            <li>Date coverage: {facts.earliestDate || 'n/a'} → {facts.latestDate || 'n/a'}</li>
          </ul>
        </div>
        <div>
          <h3>Derived with assumptions</h3>
          <ul>
            <li>Effective tax rate used: {(summary.effectiveRate * 100).toFixed(summary.includeChurchTax ? 3 : 1)}% ({summary.baseRatePercent}% base + {summary.solidarityPercent}% soli{summary.includeChurchTax ? ' + church' : ''})</li>
            <li>Gross gains implied: € {formatCurrency(summary.gainsEstimated)}</li>
            <li>Allowance applied now: € {formatCurrency(summary.exemptionAppliedNow)} (remaining {formatCurrency(summary.exemptionRemaining)})</li>
            <li>Taxable gains after allowance: € {formatCurrency(summary.taxableGains)}</li>
            <li>Expected liability: € {formatCurrency(summary.taxLiability)}</li>
          </ul>
        </div>
      </div>

      <div className="derivation-note">
        {summary.derivation}
      </div>
    </div>
  );
}

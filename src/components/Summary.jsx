import React from 'react';
import { formatCurrency } from '../utils.js';

export function Summary({ summary }) {
  const settlementLabel = summary.settlement < 0 ? 'Estimated refund' : 'Estimated amount owed';
  const settlementValue = `€ ${formatCurrency(Math.abs(summary.settlement))}`;

  return (
    <div className="card summary-card">
      <div className="summary-header">
        <div className="summary-title-section">
          <div className="summary-badge">
            <span className="badge-icon">🇩🇪</span>
            Live German tax rules
          </div>
          <h2>📊 Tax Analysis Summary</h2>
          <p className="summary-description">
            {summary.brokerAppliedExemption
              ? 'Broker already applied the allowance; we add it back before comparing.'
              : 'Broker taxed the full gains; we apply the allowance ourselves.'}
          </p>
        </div>
        <div className="tax-rate-display">
          <div className="rate-main">
            {(summary.effectiveRate * 100).toFixed(summary.includeChurchTax ? 3 : 1)}%
          </div>
          <div className="rate-breakdown">
            {summary.baseRatePercent}% base + {summary.solidarityPercent}% soli{summary.includeChurchTax ? ' + church' : ''}
          </div>
        </div>
      </div>

      <div className="summary-metrics">
        <div className="metric-group">
          <h3>💰 Financial Overview</h3>
          <div className="summary-grid">
            <SummaryBox
              title="Tax withheld from CSV"
              value={`€ ${formatCurrency(summary.totalTaxDeducted)}`}
              subtitle={`${summary.csvFacts.positiveTaxCount} taxed transactions`}
              icon="💸"
            />
            <SummaryBox
              title="Gross gains implied"
              value={`€ ${formatCurrency(summary.gainsEstimated)}`}
              subtitle="Derived from tax ÷ rate"
              icon="📈"
            />
            <SummaryBox
              title="Allowance applied"
              value={`€ ${formatCurrency(summary.exemptionAppliedNow)}`}
              subtitle={`${summary.isCouple ? 'Couple' : 'Individual'} exemption`}
              icon="🛡️"
            />
          </div>
        </div>

        <div className="metric-group">
          <h3>⚖️ Tax Calculation</h3>
          <div className="summary-grid">
            <SummaryBox
              title="Taxable gains"
              value={`€ ${formatCurrency(summary.taxableGains)}`}
              subtitle="After allowance"
              icon="📊"
            />
            <SummaryBox
              title="Tax liability"
              value={`€ ${formatCurrency(summary.taxLiability)}`}
              subtitle="What Finanzamt expects"
              icon="🏛️"
            />
            <SummaryBox
              title="Net gain after taxes"
              value={`€ ${formatCurrency(summary.gainsEstimated - summary.taxLiability)}`}
              subtitle="Profit after all taxes"
              icon="💰"
            />
          </div>
        </div>

        <div className="settlement-highlight">
          <div className="settlement-card">
            <div className="settlement-icon">
              {summary.settlement < 0 ? '💚' : '⚠️'}
            </div>
            <div className="settlement-content">
              <h3>{settlementLabel}</h3>
              <div className="settlement-amount">{settlementValue}</div>
              <p className="settlement-note">
                {summary.settlement < 0
                  ? 'You may be due a refund from the Finanzamt!'
                  : 'Additional amount to pay when filing your tax return.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryBox({ title, value, subtitle, icon }) {
  return (
    <div className="summary-box">
      <div className="summary-box-header">
        <span className="summary-icon">{icon}</span>
        <div className="summary-title">{title}</div>
      </div>
      <div className="summary-value">{value}</div>
      {subtitle && <div className="summary-subtitle">{subtitle}</div>}
    </div>
  );
}

import React from 'react';
import { formatCurrency } from '../utils.js';

export function Assumptions({ opts, onChange }) {
  const update = (key, value) => onChange({ ...opts, [key]: value });

  return (
    <div className="card assumptions-card">
      <div className="assumptions-header">
        <h2>⚙️ Tax Assumptions</h2>
        <div className="assumptions-badge">
          <span className="badge-icon">🇩🇪</span>
          German Tax Rules
        </div>
      </div>

      <p className="assumptions-description">
        Configure your tax situation to get accurate calculations. These settings affect how gains and losses are computed.
      </p>

      <div className="assumptions-sections">
        <div className="assumption-section">
          <h3>👤 Personal Situation</h3>
          <div className="assumption-grid">
            <div className="assumption-item">
              <label className="assumption-label">
                <span className="assumption-icon">💑</span>
                Taxpayer Status
              </label>
              <select
                value={opts.isCouple ? 'couple' : 'single'}
                onChange={(e) => update('isCouple', e.target.value === 'couple')}
                className="assumption-select"
              >
                <option value="single">Individual (€1,000 exemption)</option>
                <option value="couple">Married Couple (€2,000 exemption)</option>
              </select>
              <p className="assumption-help">
                Select your filing status. Couples get double the tax-free allowance.
              </p>
            </div>

            <div className="assumption-item">
              <label className="assumption-label">
                <span className="assumption-icon">📊</span>
                Exemption Already Used
              </label>
              <div className="input-with-unit">
                <input
                  type="number"
                  min="0"
                  step="10"
                  value={opts.exemptionAlreadyUsed}
                  onChange={(e) => update('exemptionAlreadyUsed', Number(e.target.value) || 0)}
                  className="assumption-input"
                />
                <span className="unit">€</span>
              </div>
              <p className="assumption-help">
                If you've used part of your allowance in previous years or other investments, enter that amount here.
              </p>
            </div>
          </div>
        </div>

        <div className="assumption-section">
          <h3>🏦 Broker Settings</h3>
          <div className="assumption-grid">
            <div className="assumption-item">
              <label className="assumption-label">
                <span className="assumption-icon">🏛️</span>
                Broker Applied Exemption?
              </label>
              <select
                value={opts.brokerAppliedExemption ? 'yes' : 'no'}
                onChange={(e) => update('brokerAppliedExemption', e.target.value === 'yes')}
                className="assumption-select"
              >
                <option value="no">No (broker taxed full amount)</option>
                <option value="yes">Yes (broker applied allowance)</option>
              </select>
              <p className="assumption-help">
                Did your broker already apply the tax-free allowance when withholding tax?
              </p>
            </div>
          </div>
        </div>

        <div className="assumption-section">
          <h3>💰 Tax Rates</h3>
          <div className="assumption-grid">
            <div className="assumption-item">
              <label className="assumption-label">
                <span className="assumption-icon">📈</span>
                Base Tax Rate
              </label>
              <div className="input-with-unit">
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={opts.baseRatePercent}
                  onChange={(e) => update('baseRatePercent', Number(e.target.value) || 0)}
                  className="assumption-input"
                />
                <span className="unit">%</span>
              </div>
              <p className="assumption-help">
                Capital gains tax rate (usually 25% for most investors).
              </p>
            </div>

            <div className="assumption-item">
              <label className="assumption-label">
                <span className="assumption-icon">➕</span>
                Solidarity Surcharge
              </label>
              <div className="input-with-unit">
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={opts.solidarityPercent}
                  onChange={(e) => update('solidarityPercent', Number(e.target.value) || 0)}
                  className="assumption-input"
                />
                <span className="unit">%</span>
              </div>
              <p className="assumption-help">
                Additional 5.5% surcharge on top of base tax.
              </p>
            </div>

            <div className="assumption-item">
              <label className="assumption-label">
                <span className="assumption-icon">⛪</span>
                Church Tax
              </label>
              <select
                value={opts.includeChurchTax ? 'yes' : 'no'}
                onChange={(e) => update('includeChurchTax', e.target.value === 'yes')}
                className="assumption-select"
              >
                <option value="no">No</option>
                <option value="yes">Yes (+8-9% on total tax)</option>
              </select>
              <p className="assumption-help">
                If you're a church member, additional tax applies (varies by state).
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="assumptions-summary">
        <div className="summary-calculation">
          <h4>📊 Your Tax Configuration</h4>
          <div className="calculation-details">
            <div className="calc-item">
              <span>Tax Rate:</span>
              <strong>{opts.baseRatePercent}% base + {opts.solidarityPercent}% soli{opts.includeChurchTax ? ' + church tax' : ''}</strong>
            </div>
            <div className="calc-item">
              <span>Exemption:</span>
              <strong>{opts.isCouple ? '€2,000' : '€1,000'} (used: €{formatCurrency(opts.exemptionAlreadyUsed)})</strong>
            </div>
          </div>
        </div>

        <div className="assumptions-warnings">
          <div className="warning-box">
            <span className="warning-icon">⚠️</span>
            <div>
              <strong>Important:</strong> These calculations are estimates based on withheld tax amounts.
              For exact figures, provide your true cost basis when filing your tax return.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

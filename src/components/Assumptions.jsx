import React from 'react';
import { formatCurrency } from '../utils.js';

export function Assumptions({ opts, onChange }) {
  const update = (key, value) => onChange({ ...opts, [key]: value });

  return (
    <div className="card">
      <h2>Assumptions (Germany)</h2>
      <div className="grid-2">
        <div>
          <span className="label">Taxpayer</span>
          <select value={opts.isCouple ? 'couple' : 'single'} onChange={(e) => update('isCouple', e.target.value === 'couple')}>
            <option value="single">Individual (EUR 1,000 exemption)</option>
            <option value="couple">Couple (EUR 2,000 exemption)</option>
          </select>
        </div>
        <div>
          <span className="label">Exemption already used</span>
          <input
            type="number"
            min="0"
            step="10"
            value={opts.exemptionAlreadyUsed}
            onChange={(e) => update('exemptionAlreadyUsed', Number(e.target.value) || 0)}
          />
          <small className="hint">We can’t infer this from the CSV—adjust if some allowance was already consumed elsewhere.</small>
        </div>
        <div>
          <span className="label">Broker already applied exemption?</span>
          <select value={opts.brokerAppliedExemption ? 'yes' : 'no'} onChange={(e) => update('brokerAppliedExemption', e.target.value === 'yes')}>
            <option value="no">No (default)</option>
            <option value="yes">Yes</option>
          </select>
        </div>
        <div>
          <span className="label">Include church tax?</span>
          <select value={opts.includeChurchTax ? 'yes' : 'no'} onChange={(e) => update('includeChurchTax', e.target.value === 'yes')}>
            <option value="no">No</option>
            <option value="yes">Yes (+0.375%)</option>
          </select>
        </div>
        <div>
          <span className="label">Base tax rate (%)</span>
          <input
            type="number"
            min="0"
            step="0.1"
            value={opts.baseRatePercent}
            onChange={(e) => update('baseRatePercent', Number(e.target.value) || 0)}
          />
        </div>
        <div>
          <span className="label">Solidarity surcharge (%)</span>
          <input
            type="number"
            min="0"
            step="0.1"
            value={opts.solidarityPercent}
            onChange={(e) => update('solidarityPercent', Number(e.target.value) || 0)}
          />
        </div>
      </div>
      <div className="assumptions" style={{ marginTop: 12 }}>
        <div>
          Germany: {opts.baseRatePercent}% base + {opts.solidarityPercent}% soli{opts.includeChurchTax ? ' + church tax' : ''} • Exemption: {opts.isCouple ? '€2,000' : '€1,000'}
        </div>
        <div className="badge-warn">All calculations are estimates based on withheld tax. Provide true cost basis later for exact gains.</div>
        <div style={{ marginTop: 6 }}>Exemption used so far: €{formatCurrency(opts.exemptionAlreadyUsed)}</div>
      </div>
    </div>
  );
}

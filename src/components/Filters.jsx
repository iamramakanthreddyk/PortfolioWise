import React from 'react';

export function Filters({ filters, onChange }) {
  const update = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <div className="card">
      <h2>Filters</h2>
      <div className="filter-bar">
        <div>
          <span className="label">From Date</span>
          <input type="date" value={filters.from || ''} onChange={(e) => update('from', e.target.value)} />
        </div>
        <div>
          <span className="label">To Date</span>
          <input type="date" value={filters.to || ''} onChange={(e) => update('to', e.target.value)} />
        </div>
        <div>
          <span className="label">Type</span>
          <select value={filters.type || ''} onChange={(e) => update('type', e.target.value)}>
            <option value="">All</option>
            <option value="Sell">Sell</option>
            <option value="Buy">Buy</option>
            <option value="Deposit">Deposit</option>
            <option value="Withdrawal">Withdrawal</option>
            <option value="Dividend">Dividend</option>
            <option value="Fee">Fee</option>
          </select>
        </div>
        <div>
          <span className="label">Tax only</span>
          <select value={filters.taxOnly || ''} onChange={(e) => update('taxOnly', e.target.value)}>
            <option value="">All</option>
            <option value="positive">Tax &gt; 0</option>
            <option value="negative">Tax &lt; 0</option>
          </select>
        </div>
      </div>
    </div>
  );
}

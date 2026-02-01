import React from 'react';

export function Filters({ filters, onChange }) {
  const update = (key, value) => onChange({ ...filters, [key]: value });

  const clearFilters = () => onChange({});

  const hasActiveFilters = Object.values(filters).some(value =>
    value !== '' && value !== undefined && value !== null
  );

  return (
    <div className="card filters-card">
      <div className="filters-header">
        <h2>🔍 Filter Transactions</h2>
        {hasActiveFilters && (
          <button className="clear-filters-btn" onClick={clearFilters}>
            Clear all
          </button>
        )}
      </div>

      <p className="filters-description">
        Narrow down your transactions to focus on specific time periods, types, or tax situations.
      </p>

      <div className="filters-grid">
        <div className="filter-group">
          <label className="filter-label">
            <span className="filter-icon">📅</span>
            Date Range
          </label>
          <div className="date-inputs">
            <div className="date-input">
              <span className="date-label">From</span>
              <input
                type="date"
                value={filters.from || ''}
                onChange={(e) => update('from', e.target.value)}
                className="filter-input"
              />
            </div>
            <div className="date-input">
              <span className="date-label">To</span>
              <input
                type="date"
                value={filters.to || ''}
                onChange={(e) => update('to', e.target.value)}
                className="filter-input"
              />
            </div>
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-label">
            <span className="filter-icon">🏷️</span>
            Transaction Type
          </label>
          <select
            value={filters.type || ''}
            onChange={(e) => update('type', e.target.value)}
            className="filter-select"
          >
            <option value="">All types</option>
            <option value="Sell">Sell</option>
            <option value="Buy">Buy</option>
            <option value="Deposit">Deposit</option>
            <option value="Withdrawal">Withdrawal</option>
            <option value="Dividend">Dividend</option>
            <option value="Fee">Fee</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">
            <span className="filter-icon">💰</span>
            Tax Status
          </label>
          <select
            value={filters.taxOnly || ''}
            onChange={(e) => update('taxOnly', e.target.value)}
            className="filter-select"
          >
            <option value="">All transactions</option>
            <option value="positive">Tax &gt; 0 (taxed)</option>
            <option value="negative">Tax &lt; 0 (losses)</option>
          </select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="active-filters">
          <span className="active-filters-label">Active filters:</span>
          <div className="filter-tags">
            {filters.from && (
              <span className="filter-tag">
                From: {new Date(filters.from).toLocaleDateString()}
                <button onClick={() => update('from', '')}>×</button>
              </span>
            )}
            {filters.to && (
              <span className="filter-tag">
                To: {new Date(filters.to).toLocaleDateString()}
                <button onClick={() => update('to', '')}>×</button>
              </span>
            )}
            {filters.type && (
              <span className="filter-tag">
                Type: {filters.type}
                <button onClick={() => update('type', '')}>×</button>
              </span>
            )}
            {filters.taxOnly && (
              <span className="filter-tag">
                Tax: {filters.taxOnly === 'positive' ? '> 0' : '< 0'}
                <button onClick={() => update('taxOnly', '')}>×</button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

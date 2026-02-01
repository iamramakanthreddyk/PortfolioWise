import React from 'react';
import { formatCurrency } from '../utils.js';
import { Chart } from './Chart.jsx';

export function Insights({ summary }) {
  const facts = summary.csvFacts || {};
  const cards = [
    { label: 'Transactions analysed', value: facts.transactions || 0 },
    { label: 'Sell orders', value: facts.sellCount || 0 },
    { label: 'Buy orders', value: facts.buyCount || 0 },
    { label: 'Sell volume', value: `€ ${formatCurrency(facts.totalSellValue || 0)}` },
    { label: 'Buy volume', value: `€ ${formatCurrency(facts.totalBuyValue || 0)}` },
    { label: 'Deposits', value: `€ ${formatCurrency(facts.totalDeposits || 0)}` },
    { label: 'Withdrawals', value: `€ ${formatCurrency(facts.totalWithdrawals || 0)}` },
    { label: 'Net cash flow', value: `€ ${formatCurrency(facts.netCashflow || 0)}` }
  ];

  // Prepare chart data: sell/buy counts and volumes

  // Bar chart: sell/buy/deposit/withdrawal counts (not volumes)
  const chartLabels = ['Sells', 'Buys', 'Deposits', 'Withdrawals'];
  const chartData = [facts.sellCount || 0, facts.buyCount || 0, facts.transactions - facts.sellCount - facts.buyCount || 0, facts.transactions - facts.sellCount - facts.buyCount || 0];

  // Monthly profit breakdown
  const monthlyProfits = {};
  if (summary && summary.rows) {
    summary.rows.forEach((r) => {
      if ((r.type || '').toLowerCase() === 'sell') {
        const date = r.date ? r.date.slice(0, 7) : 'Unknown'; // YYYY-MM
        monthlyProfits[date] = (monthlyProfits[date] || 0) + (r.amount || 0);
      }
    });
  }
  const months = Object.keys(monthlyProfits).sort();
  const profits = months.map((m) => Math.round(monthlyProfits[m] * 100) / 100);

  return (
    <div className="card insights-card">
      <h2>Dataset insights</h2>
      <p>The figures below come straight from the uploaded CSV so you can double-check completeness before filing.</p>
      <div className="insights-grid">
        {cards.map((card) => (
          <div key={card.label} className="insight-box">
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </div>
        ))}
      </div>
      <div style={{ overflowX: 'auto', marginBottom: 16 }}>
        <Chart data={chartData} labels={chartLabels} title="Activity Breakdown" height={160} />
      </div>
      {months.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <Chart data={profits} labels={months} title="Monthly Profit Breakdown" height={160} />
        </div>
      )}
    </div>
  );
}

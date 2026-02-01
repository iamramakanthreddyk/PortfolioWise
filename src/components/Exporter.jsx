import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency } from '../utils.js';

export function Exporter({ rows, summary, headers = [] }) {
  const exportCsv = () => {
    const csvHeaders = Object.keys(rows[0] || {});
    const lines = [csvHeaders.join(',')];
    rows.forEach((r) => {
      lines.push(csvHeaders.map((h) => JSON.stringify(r[h] ?? '')).join(','));
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'filtered-transactions.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportSummary = () => {
    const payload = JSON.stringify(summary, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'summary.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('German Capital Gains Summary', 14, 18);
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text('This is a helper tool for personal estimation only. No tax liability or advice is implied.', 14, 26);
    doc.setTextColor(0);

    const netGain = summary.gainsEstimated - summary.taxLiability;
    const summaryRows = [
      ['Tax withheld (CSV)', `€ ${formatCurrency(summary.totalTaxDeducted)}`],
      ['Gross gains implied', `€ ${formatCurrency(summary.gainsEstimated)}`],
      ['Allowance applied now', `€ ${formatCurrency(summary.exemptionAppliedNow)}`],
      ['Taxable gains', `€ ${formatCurrency(summary.taxableGains)}`],
      ['Expected liability', `€ ${formatCurrency(summary.taxLiability)}`],
      ['Net gain after taxes', `€ ${formatCurrency(netGain)}`]
    ];
    if (summary.settlement < 0) {
      summaryRows.push(['Estimated refund', `€ ${formatCurrency(Math.abs(summary.settlement))}`]);
    } else if (summary.settlement > 0) {
      summaryRows.push(['Estimated amount owed', `€ ${formatCurrency(summary.settlement)}`]);
    }

    autoTable(doc, {
      startY: 24,
      head: [['Metric', 'Value']],
      body: summaryRows,
      theme: 'striped'
    });

    // Add insights table
    if (summary.csvFacts) {
      const facts = summary.csvFacts;
      const insightsRows = [
        ['Transactions analysed', facts.transactions],
        ['Sell orders', facts.sellCount],
        ['Buy orders', facts.buyCount],
        ['Sell volume', `€ ${formatCurrency(facts.totalSellValue)}`],
        ['Buy volume', `€ ${formatCurrency(facts.totalBuyValue)}`],
        ['Deposits', `€ ${formatCurrency(facts.totalDeposits)}`],
        ['Withdrawals', `€ ${formatCurrency(facts.totalWithdrawals)}`],
        ['Net cash flow', `€ ${formatCurrency(facts.netCashflow)}`]
      ];
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        head: [['Insight', 'Value']],
        body: insightsRows,
        theme: 'grid',
        styles: { fontSize: 9 }
      });
    }

    // Removed sample transaction table from PDF export

    doc.save('tax-summary.pdf');
  };

  // Print Tax Snapshot just downloads PDF
  return (
    <div className="flex-row" style={{ justifyContent: 'flex-end' }}>
      <button className="export-btn" onClick={exportCsv}>Export filtered CSV</button>
      <button onClick={exportSummary}>Export summary JSON</button>
      <button onClick={exportPdf}>Export/Print Tax Snapshot (PDF)</button>
    </div>
  );
}

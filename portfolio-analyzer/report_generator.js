/**
 * HTML Report Generator
 * Creates beautiful, interactive HTML reports from portfolio analysis
 */

const fs = require('fs');
const path = require('path');
const PortfolioCalculator = require('./portfolio_calculator');

class ReportGenerator {
  /**
   * Generate HTML report
   */
  static generateHTMLReport(analysis, options = {}) {
    const {
      title = 'Portfolio Analysis Report',
      date = new Date().toLocaleDateString('de-DE'),
      exemptionScenario = 'Couple (€2,000)'
    } = options;

    const taxLiability = analysis.tax_liability;
    const summary = analysis.summary;

    // Color coding
    const refundColor = taxLiability.tax_refund > 0 ? '#22c55e' : '#ef4444';
    const profitColor = summary.total_realized_gains > 0 ? '#22c55e' : '#ef4444';

    const html = `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
            color: #333;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 32px;
            margin-bottom: 10px;
        }
        
        .header .date {
            font-size: 14px;
            opacity: 0.9;
        }
        
        .content {
            padding: 40px;
        }
        
        .section {
            margin-bottom: 40px;
        }
        
        .section h2 {
            font-size: 20px;
            color: #667eea;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #f0f0f0;
        }
        
        .cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }
        
        .card {
            background: #f8f9fa;
            border-left: 4px solid #667eea;
            padding: 20px;
            border-radius: 8px;
            transition: all 0.3s ease;
        }
        
        .card:hover {
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
            transform: translateY(-2px);
        }
        
        .card .label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
        }
        
        .card .value {
            font-size: 24px;
            font-weight: bold;
            color: #333;
        }
        
        .card.profit .value {
            color: ${profitColor};
        }
        
        .card.refund .value {
            color: ${refundColor};
        }
        
        .table-wrapper {
            overflow-x: auto;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            background: white;
        }
        
        th {
            background: #f0f0f0;
            padding: 12px;
            text-align: left;
            font-weight: 600;
            color: #333;
            border-bottom: 2px solid #ddd;
        }
        
        td {
            padding: 12px;
            border-bottom: 1px solid #eee;
        }
        
        tr:hover {
            background: #f9f9f9;
        }
        
        .highlight {
            background: #fff3cd;
            padding: 15px;
            border-left: 4px solid #ffc107;
            border-radius: 4px;
            margin: 20px 0;
        }
        
        .success {
            background: #d4edda;
            border-color: #28a745;
        }
        
        .danger {
            background: #f8d7da;
            border-color: #dc3545;
        }
        
        .footer {
            background: #f8f9fa;
            padding: 20px 40px;
            text-align: center;
            color: #666;
            font-size: 12px;
            border-top: 1px solid #ddd;
        }
        
        .chart-container {
            margin: 30px 0;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
        }
        
        .key-metric {
            background: white;
            border: 2px solid #667eea;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
        }
        
        .key-metric .value {
            font-size: 36px;
            font-weight: bold;
            color: #667eea;
            margin: 10px 0;
        }
        
        .key-metric .label {
            color: #666;
            font-size: 14px;
        }
        
        .scenario-box {
            background: #f8f9fa;
            padding: 20px;
            margin: 10px 0;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }
        
        .scenario-box strong {
            color: #667eea;
        }
        
        @media print {
            body {
                background: white;
            }
            .container {
                box-shadow: none;
            }
            .cards {
                break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${title}</h1>
            <div class="date">Report Date: ${date}</div>
        </div>
        
        <div class="content">
            <!-- KEY METRICS -->
            <div class="section">
                <h2>📊 Investment Summary</h2>
                <div class="cards">
                    <div class="card">
                        <div class="label">Total Invested</div>
                        <div class="value">EUR ${summary.total_invested.toLocaleString('de-DE', {minimumFractionDigits: 2})}</div>
                    </div>
                    <div class="card">
                        <div class="label">Total Proceeds</div>
                        <div class="value">EUR ${summary.total_proceeds.toLocaleString('de-DE', {minimumFractionDigits: 2})}</div>
                    </div>
                    <div class="card profit">
                        <div class="label">Realized Gains</div>
                        <div class="value">EUR ${summary.total_realized_gains.toLocaleString('de-DE', {minimumFractionDigits: 2})}</div>
                    </div>
                    <div class="card">
                        <div class="label">Return %</div>
                        <div class="value">${summary.return_percentage}%</div>
                    </div>
                </div>
            </div>
            
            <!-- TAX LIABILITY -->
            <div class="section">
                <h2>💰 Tax Calculation</h2>
                <div class="key-metric ${taxLiability.tax_refund > 0 ? 'success' : 'danger'}">
                    <div class="label">${taxLiability.tax_refund > 0 ? '✅ TAX REFUND' : '⚠️ TAX OWED'}</div>
                    <div class="value">EUR ${(taxLiability.tax_refund || taxLiability.tax_owed).toLocaleString('de-DE', {minimumFractionDigits: 2})}</div>
                    <div class="label">Scenario: ${exemptionScenario}</div>
                </div>
                
                <div class="cards">
                    <div class="card">
                        <div class="label">Gross Gains</div>
                        <div class="value">EUR ${taxLiability.total_gains.toLocaleString('de-DE', {minimumFractionDigits: 2})}</div>
                    </div>
                    <div class="card">
                        <div class="label">Exemption</div>
                        <div class="value">EUR ${taxLiability.exemption_available.toLocaleString('de-DE', {minimumFractionDigits: 2})}</div>
                    </div>
                    <div class="card">
                        <div class="label">Taxable Gains</div>
                        <div class="value">EUR ${taxLiability.taxable_gains.toLocaleString('de-DE', {minimumFractionDigits: 2})}</div>
                    </div>
                    <div class="card">
                        <div class="label">Tax Rate</div>
                        <div class="value">${taxLiability.tax_rate}</div>
                    </div>
                    <div class="card">
                        <div class="label">Gross Liability</div>
                        <div class="value">EUR ${taxLiability.gross_tax_liability.toLocaleString('de-DE', {minimumFractionDigits: 2})}</div>
                    </div>
                    <div class="card">
                        <div class="label">Already Paid</div>
                        <div class="value">EUR ${taxLiability.tax_already_paid.toLocaleString('de-DE', {minimumFractionDigits: 2})}</div>
                    </div>
                </div>
                
                <div class="highlight ${taxLiability.tax_refund > 0 ? 'success' : ''}">
                    <strong>Explanation:</strong> Your broker withheld EUR ${taxLiability.tax_already_paid.toLocaleString('de-DE', {minimumFractionDigits: 2})} in taxes, 
                    but your actual tax liability is EUR ${taxLiability.gross_tax_liability.toLocaleString('de-DE', {minimumFractionDigits: 2})} 
                    after applying the EUR ${taxLiability.exemption_available.toLocaleString('de-DE', {minimumFractionDigits: 2})} exemption. 
                    ${taxLiability.tax_refund > 0 ? 
                        'Your broker over-withheld by EUR ' + taxLiability.tax_refund.toLocaleString('de-DE', {minimumFractionDigits: 2}) + ' - you can reclaim this in your tax return!' :
                        'You owe EUR ' + taxLiability.tax_owed.toLocaleString('de-DE', {minimumFractionDigits: 2}) + ' additional tax.'
                    }
                </div>
            </div>
            
            <!-- TOP GAINS -->
            <div class="section">
                <h2>🏆 Top 5 Assets by Gain</h2>
                <div class="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>ISIN</th>
                                <th>Realized Gain (EUR)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${analysis.top_5_gains.map((item, i) => `
                            <tr>
                                <td><strong>#${i + 1}</strong></td>
                                <td>${item.isin}</td>
                                <td style="color: ${item.gain > 0 ? '#22c55e' : '#ef4444'}; font-weight: bold;">
                                    EUR ${item.gain.toLocaleString('de-DE', {minimumFractionDigits: 2})}
                                </td>
                            </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- COST BASIS DETAIL -->
            <div class="section">
                <h2>📋 Cost Basis Summary (FIFO Method)</h2>
                <div class="cards">
                    <div class="card">
                        <div class="label">Total Invested</div>
                        <div class="value">EUR ${analysis.cost_basis.total_invested.toLocaleString('de-DE', {minimumFractionDigits: 2})}</div>
                    </div>
                    <div class="card">
                        <div class="label">Cost Basis (Sold)</div>
                        <div class="value">EUR ${analysis.cost_basis.total_cost_of_sold.toLocaleString('de-DE', {minimumFractionDigits: 2})}</div>
                    </div>
                    <div class="card">
                        <div class="label">Proceeds</div>
                        <div class="value">EUR ${analysis.cost_basis.total_proceeds.toLocaleString('de-DE', {minimumFractionDigits: 2})}</div>
                    </div>
                </div>
            </div>
            
            <!-- SCENARIOS -->
            <div class="section">
                <h2>📊 Scenario Comparison</h2>
                <div class="scenario-box">
                    <strong>Current Selection: ${exemptionScenario}</strong><br>
                    Tax Refund: EUR ${taxLiability.tax_refund.toLocaleString('de-DE', {minimumFractionDigits: 2})}
                </div>
                <p style="color: #666; margin-top: 20px;">
                    ℹ️ This report shows the <strong>${exemptionScenario}</strong> scenario.
                    Compare with other options in the interactive dashboard for full analysis.
                </p>
            </div>
        </div>
        
        <div class="footer">
            <p>🇩🇪 Portfolio Analysis Report | German Tax Edition | Scalable Capital Transactions</p>
            <p>Generated: ${new Date().toLocaleString('de-DE')}</p>
            <p>This report is for informational purposes. Please consult with a tax advisor before filing.</p>
        </div>
    </div>
</body>
</html>`;

    return html;
  }

  /**
   * Generate comparison HTML
   */
  static generateComparisonReport(csvContent) {
    const scenarios = PortfolioCalculator.generateScenarios(csvContent);
    const date = new Date().toLocaleDateString('de-DE');

    const html = `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tax Scenario Comparison</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
            color: #333;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 32px;
            margin-bottom: 10px;
        }
        
        .content {
            padding: 40px;
        }
        
        .scenarios {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        
        .scenario {
            border: 2px solid #667eea;
            border-radius: 8px;
            padding: 25px;
            background: #f9f9f9;
            transition: all 0.3s ease;
        }
        
        .scenario:hover {
            box-shadow: 0 8px 24px rgba(102, 126, 234, 0.2);
            transform: translateY(-4px);
        }
        
        .scenario h3 {
            color: #667eea;
            margin-bottom: 20px;
            font-size: 18px;
            padding-bottom: 10px;
            border-bottom: 2px solid #ddd;
        }
        
        .scenario-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }
        
        .scenario-item:last-child {
            border-bottom: none;
        }
        
        .label {
            color: #666;
            font-size: 13px;
        }
        
        .value {
            font-weight: bold;
            color: #333;
        }
        
        .refund {
            color: #22c55e;
            font-weight: bold;
            background: #d4edda;
            padding: 10px;
            border-radius: 4px;
            margin-top: 15px;
            text-align: center;
            font-size: 16px;
        }
        
        .comparison-table {
            margin: 40px 0;
            width: 100%;
            border-collapse: collapse;
        }
        
        .comparison-table th {
            background: #667eea;
            color: white;
            padding: 15px;
            text-align: left;
        }
        
        .comparison-table td {
            padding: 12px 15px;
            border-bottom: 1px solid #ddd;
        }
        
        .comparison-table tr:hover {
            background: #f9f9f9;
        }
        
        .recommendation {
            background: #d4edda;
            border-left: 4px solid #28a745;
            padding: 20px;
            margin: 30px 0;
            border-radius: 4px;
        }
        
        .recommendation h4 {
            color: #28a745;
            margin-bottom: 10px;
        }
        
        .footer {
            background: #f8f9fa;
            padding: 20px 40px;
            text-align: center;
            color: #666;
            font-size: 12px;
            border-top: 1px solid #ddd;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Tax Scenario Comparison</h1>
            <div>Compare all 4 filing scenarios</div>
        </div>
        
        <div class="content">
            <div class="scenarios">
                <div class="scenario">
                    <h3>Single (€1,000)</h3>
                    <div class="scenario-item">
                        <span class="label">Gross Gains:</span>
                        <span class="value">EUR ${scenarios.individual.summary.total_realized_gains.toLocaleString('de-DE', {minimumFractionDigits: 2})}</span>
                    </div>
                    <div class="scenario-item">
                        <span class="label">Exemption:</span>
                        <span class="value">EUR ${scenarios.individual.tax_liability.exemption_available.toLocaleString('de-DE', {minimumFractionDigits: 2})}</span>
                    </div>
                    <div class="scenario-item">
                        <span class="label">Taxable:</span>
                        <span class="value">EUR ${scenarios.individual.tax_liability.taxable_gains.toLocaleString('de-DE', {minimumFractionDigits: 2})}</span>
                    </div>
                    <div class="scenario-item">
                        <span class="label">Tax Rate:</span>
                        <span class="value">${scenarios.individual.tax_liability.tax_rate}</span>
                    </div>
                    <div class="refund">
                        EUR ${scenarios.individual.tax_liability.tax_refund.toLocaleString('de-DE', {minimumFractionDigits: 2})} refund
                    </div>
                </div>
                
                <div class="scenario" style="border-color: #28a745; background: #f0fdf4;">
                    <h3 style="color: #28a745;">💑 Couple (€2,000) ⭐</h3>
                    <div class="scenario-item">
                        <span class="label">Gross Gains:</span>
                        <span class="value">EUR ${scenarios.couple.summary.total_realized_gains.toLocaleString('de-DE', {minimumFractionDigits: 2})}</span>
                    </div>
                    <div class="scenario-item">
                        <span class="label">Exemption:</span>
                        <span class="value">EUR ${scenarios.couple.tax_liability.exemption_available.toLocaleString('de-DE', {minimumFractionDigits: 2})}</span>
                    </div>
                    <div class="scenario-item">
                        <span class="label">Taxable:</span>
                        <span class="value">EUR ${scenarios.couple.tax_liability.taxable_gains.toLocaleString('de-DE', {minimumFractionDigits: 2})}</span>
                    </div>
                    <div class="scenario-item">
                        <span class="label">Tax Rate:</span>
                        <span class="value">${scenarios.couple.tax_liability.tax_rate}</span>
                    </div>
                    <div class="refund" style="background: #c7f0d8; color: #22c55e;">
                        EUR ${scenarios.couple.tax_liability.tax_refund.toLocaleString('de-DE', {minimumFractionDigits: 2})} refund
                    </div>
                </div>
                
                <div class="scenario">
                    <h3>Single + Church Tax</h3>
                    <div class="scenario-item">
                        <span class="label">Exemption:</span>
                        <span class="value">EUR ${scenarios.individual_with_church_tax.tax_liability.exemption_available.toLocaleString('de-DE', {minimumFractionDigits: 2})}</span>
                    </div>
                    <div class="scenario-item">
                        <span class="label">Tax Rate:</span>
                        <span class="value">${scenarios.individual_with_church_tax.tax_liability.tax_rate}</span>
                    </div>
                    <div class="scenario-item">
                        <span class="label">Gross Liability:</span>
                        <span class="value">EUR ${scenarios.individual_with_church_tax.tax_liability.gross_tax_liability.toLocaleString('de-DE', {minimumFractionDigits: 2})}</span>
                    </div>
                    <div class="refund">
                        EUR ${scenarios.individual_with_church_tax.tax_liability.tax_refund.toLocaleString('de-DE', {minimumFractionDigits: 2})} refund
                    </div>
                </div>
                
                <div class="scenario">
                    <h3>Couple + Church Tax</h3>
                    <div class="scenario-item">
                        <span class="label">Exemption:</span>
                        <span class="value">EUR ${scenarios.couple_with_church_tax.tax_liability.exemption_available.toLocaleString('de-DE', {minimumFractionDigits: 2})}</span>
                    </div>
                    <div class="scenario-item">
                        <span class="label">Tax Rate:</span>
                        <span class="value">${scenarios.couple_with_church_tax.tax_liability.tax_rate}</span>
                    </div>
                    <div class="scenario-item">
                        <span class="label">Gross Liability:</span>
                        <span class="value">EUR ${scenarios.couple_with_church_tax.tax_liability.gross_tax_liability.toLocaleString('de-DE', {minimumFractionDigits: 2})}</span>
                    </div>
                    <div class="refund">
                        EUR ${scenarios.couple_with_church_tax.tax_liability.tax_refund.toLocaleString('de-DE', {minimumFractionDigits: 2})} refund
                    </div>
                </div>
            </div>
            
            <div class="recommendation">
                <h4>✅ Recommendation</h4>
                <p>
                    If you're married, file as <strong>Couple (€2,000 exemption)</strong> to save 
                    <strong>EUR ${(scenarios.couple.tax_liability.tax_refund - scenarios.individual.tax_liability.tax_refund).toLocaleString('de-DE', {minimumFractionDigits: 2})}</strong> in taxes.
                    ${scenarios.couple_with_church_tax.tax_liability.tax_rate !== scenarios.couple.tax_liability.tax_rate ? 
                        'Church tax applies, increasing your rate to ' + scenarios.couple_with_church_tax.tax_liability.tax_rate + '.' : 
                        ''
                    }
                </p>
            </div>
            
            <h3 style="margin-top: 40px; color: #667eea;">Detailed Comparison Table</h3>
            <table class="comparison-table">
                <thead>
                    <tr>
                        <th>Metric</th>
                        <th>Single (€1k)</th>
                        <th>Couple (€2k)</th>
                        <th>Single + Church</th>
                        <th>Couple + Church</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Gross Gains</strong></td>
                        <td>EUR ${scenarios.individual.tax_liability.total_gains.toLocaleString('de-DE', {minimumFractionDigits: 2})}</td>
                        <td>EUR ${scenarios.couple.tax_liability.total_gains.toLocaleString('de-DE', {minimumFractionDigits: 2})}</td>
                        <td>EUR ${scenarios.individual_with_church_tax.tax_liability.total_gains.toLocaleString('de-DE', {minimumFractionDigits: 2})}</td>
                        <td>EUR ${scenarios.couple_with_church_tax.tax_liability.total_gains.toLocaleString('de-DE', {minimumFractionDigits: 2})}</td>
                    </tr>
                    <tr>
                        <td><strong>Exemption</strong></td>
                        <td>EUR ${scenarios.individual.tax_liability.exemption_available.toLocaleString('de-DE', {minimumFractionDigits: 2})}</td>
                        <td>EUR ${scenarios.couple.tax_liability.exemption_available.toLocaleString('de-DE', {minimumFractionDigits: 2})}</td>
                        <td>EUR ${scenarios.individual_with_church_tax.tax_liability.exemption_available.toLocaleString('de-DE', {minimumFractionDigits: 2})}</td>
                        <td>EUR ${scenarios.couple_with_church_tax.tax_liability.exemption_available.toLocaleString('de-DE', {minimumFractionDigits: 2})}</td>
                    </tr>
                    <tr>
                        <td><strong>Taxable Gains</strong></td>
                        <td>EUR ${scenarios.individual.tax_liability.taxable_gains.toLocaleString('de-DE', {minimumFractionDigits: 2})}</td>
                        <td>EUR ${scenarios.couple.tax_liability.taxable_gains.toLocaleString('de-DE', {minimumFractionDigits: 2})}</td>
                        <td>EUR ${scenarios.individual_with_church_tax.tax_liability.taxable_gains.toLocaleString('de-DE', {minimumFractionDigits: 2})}</td>
                        <td>EUR ${scenarios.couple_with_church_tax.tax_liability.taxable_gains.toLocaleString('de-DE', {minimumFractionDigits: 2})}</td>
                    </tr>
                    <tr>
                        <td><strong>Tax Rate</strong></td>
                        <td>${scenarios.individual.tax_liability.tax_rate}</td>
                        <td>${scenarios.couple.tax_liability.tax_rate}</td>
                        <td>${scenarios.individual_with_church_tax.tax_liability.tax_rate}</td>
                        <td>${scenarios.couple_with_church_tax.tax_liability.tax_rate}</td>
                    </tr>
                    <tr>
                        <td><strong>Gross Liability</strong></td>
                        <td>EUR ${scenarios.individual.tax_liability.gross_tax_liability.toLocaleString('de-DE', {minimumFractionDigits: 2})}</td>
                        <td>EUR ${scenarios.couple.tax_liability.gross_tax_liability.toLocaleString('de-DE', {minimumFractionDigits: 2})}</td>
                        <td>EUR ${scenarios.individual_with_church_tax.tax_liability.gross_tax_liability.toLocaleString('de-DE', {minimumFractionDigits: 2})}</td>
                        <td>EUR ${scenarios.couple_with_church_tax.tax_liability.gross_tax_liability.toLocaleString('de-DE', {minimumFractionDigits: 2})}</td>
                    </tr>
                    <tr style="background: #f0fdf4;">
                        <td><strong>💰 TAX REFUND</strong></td>
                        <td><strong>EUR ${scenarios.individual.tax_liability.tax_refund.toLocaleString('de-DE', {minimumFractionDigits: 2})}</strong></td>
                        <td><strong style="color: #28a745;">EUR ${scenarios.couple.tax_liability.tax_refund.toLocaleString('de-DE', {minimumFractionDigits: 2})} ⭐</strong></td>
                        <td><strong>EUR ${scenarios.individual_with_church_tax.tax_liability.tax_refund.toLocaleString('de-DE', {minimumFractionDigits: 2})}</strong></td>
                        <td><strong>EUR ${scenarios.couple_with_church_tax.tax_liability.tax_refund.toLocaleString('de-DE', {minimumFractionDigits: 2})}</strong></td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div class="footer">
            <p>Generated: ${new Date().toLocaleString('de-DE')}</p>
            <p>This comparison is for informational purposes. Consult with a tax advisor before filing.</p>
        </div>
    </div>
</body>
</html>`;

    return html;
  }

  /**
   * Save report to file
   */
  static saveReport(content, filename) {
    const reportPath = path.join(__dirname, 'reports', filename);
    fs.writeFileSync(reportPath, content, 'utf-8');
    return reportPath;
  }
}

// CLI usage
if (require.main === module) {
  const csvPath = process.argv[2] || './2026-01-31_16-07-16_ScalableCapital-Broker-Transactions.csv';
  const outputDir = './reports';
  
  // Ensure reports directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  try {
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    
    console.log('\n📊 Generating HTML Reports...\n');
    
    // Generate main report (couple scenario)
    const analysis = PortfolioCalculator.analyzPortfolio(csvContent, { isCouple: true });
    const mainReport = ReportGenerator.generateHTMLReport(analysis, {
      title: 'Portfolio Analysis Report',
      exemptionScenario: 'Couple (€2,000)'
    });
    const mainPath = ReportGenerator.saveReport(mainReport, 'portfolio_analysis.html');
    console.log(`✅ Main Report:       ${mainPath}`);
    
    // Generate comparison report
    const comparisonReport = ReportGenerator.generateComparisonReport(csvContent);
    const comparisonPath = ReportGenerator.saveReport(comparisonReport, 'scenario_comparison.html');
    console.log(`✅ Comparison Report: ${comparisonPath}`);
    
    console.log('\n📂 Reports saved to ./portfolio-analyzer/reports/');
    console.log('   - portfolio_analysis.html (default couple scenario)');
    console.log('   - scenario_comparison.html (all 4 scenarios)');
    console.log('\n💡 Open these files in your browser to view beautifully formatted reports!\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

module.exports = ReportGenerator;

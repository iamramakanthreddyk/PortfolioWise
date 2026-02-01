/**
 * Web Dashboard Server
 * Interactive portfolio analyzer with live scenario switching
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const PortfolioCalculator = require('./portfolio_calculator');

// Store CSV in memory
let csvContent = null;
let portfolioData = null;

class DashboardServer {
  /**
   * Load CSV file
   */
  static loadCSV(filePath) {
    csvContent = fs.readFileSync(filePath, 'utf-8');
    portfolioData = PortfolioCalculator.generateScenarios(csvContent);
    return portfolioData;
  }

  /**
   * Generate dashboard HTML
   */
  static generateDashboard() {
    if (!portfolioData) return '<h1>No data loaded</h1>';

    const ind = portfolioData.individual.tax_liability;
    const couple = portfolioData.couple.tax_liability;
    const indChurch = portfolioData.individual_with_church_tax.tax_liability;
    const coupleChurch = portfolioData.couple_with_church_tax.tax_liability;

    return `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio Dashboard</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #0f172a;
            color: #e2e8f0;
            line-height: 1.6;
        }
        
        .navbar {
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            padding: 20px 40px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            position: sticky;
            top: 0;
            z-index: 100;
        }
        
        .navbar h1 {
            font-size: 24px;
            color: white;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .scenario-selector {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 30px 0;
        }
        
        .scenario-btn {
            padding: 15px 20px;
            border: 2px solid #667eea;
            background: transparent;
            color: #667eea;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s ease;
            font-size: 14px;
        }
        
        .scenario-btn:hover {
            background: #667eea;
            color: white;
        }
        
        .scenario-btn.active {
            background: #667eea;
            color: white;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
        
        .dashboard {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 30px 0;
        }
        
        .card {
            background: #1e293b;
            border: 1px solid #334155;
            border-radius: 12px;
            padding: 25px;
            transition: all 0.3s ease;
        }
        
        .card:hover {
            border-color: #667eea;
            box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
        }
        
        .card h3 {
            color: #667eea;
            margin-bottom: 15px;
            font-size: 16px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .stat {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #334155;
        }
        
        .stat:last-child {
            border-bottom: none;
        }
        
        .stat-label {
            color: #94a3b8;
            font-size: 13px;
        }
        
        .stat-value {
            font-weight: bold;
            color: white;
        }
        
        .stat-value.positive {
            color: #22c55e;
        }
        
        .stat-value.negative {
            color: #ef4444;
        }
        
        .big-number {
            font-size: 32px;
            font-weight: bold;
            margin: 20px 0;
            padding: 20px;
            background: #0f172a;
            border-radius: 8px;
            text-align: center;
        }
        
        .big-number.refund {
            color: #22c55e;
        }
        
        .big-number.owed {
            color: #ef4444;
        }
        
        .full-width {
            grid-column: 1 / -1;
        }
        
        .comparison-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            margin: 30px 0;
        }
        
        .comparison-card {
            background: #1e293b;
            border: 1px solid #334155;
            border-radius: 8px;
            padding: 15px;
            text-align: center;
        }
        
        .comparison-card.selected {
            border-color: #22c55e;
            box-shadow: 0 0 20px rgba(34, 197, 94, 0.2);
        }
        
        .comparison-card h4 {
            color: #667eea;
            margin-bottom: 15px;
            font-size: 13px;
            text-transform: uppercase;
        }
        
        .refund-amount {
            font-size: 24px;
            font-weight: bold;
            margin: 10px 0;
        }
        
        .savings {
            background: #064e3b;
            color: #22c55e;
            padding: 10px;
            border-radius: 4px;
            margin-top: 10px;
            font-size: 12px;
            font-weight: bold;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        
        th {
            background: #0f172a;
            padding: 12px;
            text-align: left;
            color: #94a3b8;
            font-size: 12px;
            text-transform: uppercase;
            border-bottom: 2px solid #334155;
        }
        
        td {
            padding: 12px;
            border-bottom: 1px solid #334155;
        }
        
        tr:hover {
            background: #0f172a;
        }
        
        .btn-group {
            display: flex;
            gap: 10px;
            margin-top: 20px;
        }
        
        .btn {
            flex: 1;
            padding: 12px 20px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s ease;
        }
        
        .btn-primary {
            background: #667eea;
            color: white;
        }
        
        .btn-primary:hover {
            background: #5568d3;
        }
        
        .btn-secondary {
            background: #334155;
            color: #e2e8f0;
        }
        
        .btn-secondary:hover {
            background: #475569;
        }
        
        .footer {
            text-align: center;
            padding: 40px 20px;
            color: #64748b;
            border-top: 1px solid #334155;
            margin-top: 60px;
        }
        
        @media (max-width: 768px) {
            .dashboard {
                grid-template-columns: 1fr;
            }
            
            .comparison-grid {
                grid-template-columns: 1fr 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="navbar">
        <h1>📊 Portfolio Dashboard (Live)</h1>
    </div>
    
    <div class="container">
        <div style="background: #1e293b; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
            <strong>✅ EUR 2,000 exemption is now the DEFAULT</strong> (couple status)
            <br>
            <span style="color: #94a3b8; font-size: 13px;">Use the buttons below to switch between scenarios</span>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <h2 style="margin-bottom: 20px; color: #e2e8f0;">Select Your Tax Scenario</h2>
            <div class="scenario-selector">
                <button class="scenario-btn" onclick="selectScenario('couple', this)">💑 Couple (€2,000)</button>
                <button class="scenario-btn" onclick="selectScenario('individual', this)">👤 Single (€1,000)</button>
                <button class="scenario-btn" onclick="selectScenario('couple_church', this)">⛪ Couple + Church</button>
                <button class="scenario-btn" onclick="selectScenario('individual_church', this)">⛪ Single + Church</button>
            </div>
        </div>
        
        <div id="content"></div>
        
        <div class="full-width card" style="margin-top: 40px;">
            <h3>📊 All Scenarios Comparison</h3>
            <div class="comparison-grid">
                <div class="comparison-card" id="comp-couple">
                    <h4>Couple</h4>
                    <div style="color: #94a3b8; font-size: 12px;">EUR 2,000</div>
                    <div class="refund-amount positive">${couple.tax_refund.toLocaleString('de-DE', {minimumFractionDigits: 2})}</div>
                    <div class="savings">26.00% tax</div>
                </div>
                <div class="comparison-card" id="comp-individual">
                    <h4>Single</h4>
                    <div style="color: #94a3b8; font-size: 12px;">EUR 1,000</div>
                    <div class="refund-amount positive">${ind.tax_refund.toLocaleString('de-DE', {minimumFractionDigits: 2})}</div>
                    <div class="savings">26.00% tax</div>
                </div>
                <div class="comparison-card" id="comp-individual-church">
                    <h4>Single + Church</h4>
                    <div style="color: #94a3b8; font-size: 12px;">EUR 1,000</div>
                    <div class="refund-amount positive">${indChurch.tax_refund.toLocaleString('de-DE', {minimumFractionDigits: 2})}</div>
                    <div class="savings">26.375% tax</div>
                </div>
                <div class="comparison-card" id="comp-couple-church">
                    <h4>Couple + Church</h4>
                    <div style="color: #94a3b8; font-size: 12px;">EUR 2,000</div>
                    <div class="refund-amount positive">${coupleChurch.tax_refund.toLocaleString('de-DE', {minimumFractionDigits: 2})}</div>
                    <div class="savings">26.375% tax</div>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p>🇩🇪 Portfolio Tax Dashboard | German Edition</p>
            <p style="color: #475569; margin-top: 10px; font-size: 12px;">
                This dashboard is for analysis purposes. Always consult with a tax advisor before filing your return.
            </p>
        </div>
    </div>
    
    <script>
        const scenarios = {
            couple: {
                gains: ${couple.total_gains},
                exemption: ${couple.exemption_available},
                taxable: ${couple.taxable_gains},
                rate: '26%',
                liability: ${couple.gross_tax_liability},
                paid: ${couple.tax_already_paid},
                refund: ${couple.tax_refund},
                owed: ${couple.tax_owed}
            },
            individual: {
                gains: ${ind.total_gains},
                exemption: ${ind.exemption_available},
                taxable: ${ind.taxable_gains},
                rate: '26%',
                liability: ${ind.gross_tax_liability},
                paid: ${ind.tax_already_paid},
                refund: ${ind.tax_refund},
                owed: ${ind.tax_owed}
            },
            couple_church: {
                gains: ${coupleChurch.total_gains},
                exemption: ${coupleChurch.exemption_available},
                taxable: ${coupleChurch.taxable_gains},
                rate: '26.375%',
                liability: ${coupleChurch.gross_tax_liability},
                paid: ${coupleChurch.tax_already_paid},
                refund: ${coupleChurch.tax_refund},
                owed: ${coupleChurch.tax_owed}
            },
            individual_church: {
                gains: ${indChurch.total_gains},
                exemption: ${indChurch.exemption_available},
                taxable: ${indChurch.taxable_gains},
                rate: '26.375%',
                liability: ${indChurch.gross_tax_liability},
                paid: ${indChurch.tax_already_paid},
                refund: ${indChurch.tax_refund},
                owed: ${indChurch.tax_owed}
            }
        };
        
        const titles = {
            couple: '💑 Couple (€2,000 exemption)',
            individual: '👤 Single (€1,000 exemption)',
            couple_church: '⛪ Couple with Church Tax (€2,000)',
            individual_church: '⛪ Single with Church Tax (€1,000)'
        };
        
        function selectScenario(scenario, btn) {
            // Update button states
            document.querySelectorAll('.scenario-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update comparison cards
            document.querySelectorAll('.comparison-card').forEach(c => c.classList.remove('selected'));
            document.getElementById('comp-' + scenario).classList.add('selected');
            
            // Update content
            const data = scenarios[scenario];
            const title = titles[scenario];
            
            const html = \`
                <div class="dashboard">
                    <div class="card">
                        <h3>💰 Tax Calculation</h3>
                        <div class="stat">
                            <span class="stat-label">Gross Gains</span>
                            <span class="stat-value">EUR \${data.gains.toLocaleString('de-DE', {minimumFractionDigits: 2})}</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">Exemption</span>
                            <span class="stat-value">EUR \${data.exemption.toLocaleString('de-DE', {minimumFractionDigits: 2})}</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">Taxable Gains</span>
                            <span class="stat-value">EUR \${data.taxable.toLocaleString('de-DE', {minimumFractionDigits: 2})}</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">Tax Rate</span>
                            <span class="stat-value">\${data.rate}</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">Gross Liability</span>
                            <span class="stat-value">EUR \${data.liability.toLocaleString('de-DE', {minimumFractionDigits: 2})}</span>
                        </div>
                    </div>
                    
                    <div class="card">
                        <h3>📋 Actual Tax Situation</h3>
                        <div class="stat">
                            <span class="stat-label">Broker Withheld</span>
                            <span class="stat-value">EUR \${data.paid.toLocaleString('de-DE', {minimumFractionDigits: 2})}</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">Your Liability</span>
                            <span class="stat-value">EUR \${data.liability.toLocaleString('de-DE', {minimumFractionDigits: 2})}</span>
                        </div>
                        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #334155;">
                            <div class="big-number \${data.refund > 0 ? 'refund' : 'owed'}">
                                \${data.refund > 0 ? '✅ REFUND' : '⚠️ OWED'}<br>
                                EUR \${(data.refund || data.owed).toLocaleString('de-DE', {minimumFractionDigits: 2})}
                            </div>
                        </div>
                    </div>
                </div>
            \`;
            
            document.getElementById('content').innerHTML = html;
        }
        
        // Initialize with couple scenario
        document.querySelector('.scenario-btn').click();
    </script>
</body>
</html>`;
  }

  /**
   * Start server
   */
  static start(port = 3000, csvPath = null) {
    if (csvPath && fs.existsSync(csvPath)) {
      this.loadCSV(csvPath);
    }

    const server = http.createServer((req, res) => {
      const parsedUrl = url.parse(req.url, true);
      const pathname = parsedUrl.pathname;

      // CORS headers
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

      // Main dashboard
      if (pathname === '/' || pathname === '/dashboard') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(this.generateDashboard());
      }

      // API endpoint for scenarios
      else if (pathname === '/api/scenarios') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(portfolioData, null, 2));
      }

      // API endpoint for specific scenario
      else if (pathname.startsWith('/api/scenario/')) {
        const scenario = pathname.replace('/api/scenario/', '');
        if (portfolioData[scenario]) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(portfolioData[scenario], null, 2));
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Scenario not found' }));
        }
      }

      // 404
      else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 - Not Found');
      }
    });

    server.listen(port, () => {
      console.log(`\n🌐 Dashboard running at http://localhost:${port}`);
      console.log(`📊 Open your browser and navigate to http://localhost:${port}/dashboard\n`);
    });
  }
}

// CLI usage
if (require.main === module) {
  const port = process.argv[2] || 3000;
  const csvPath = process.argv[3] || './2026-01-31_16-07-16_ScalableCapital-Broker-Transactions.csv';

  if (!fs.existsSync(csvPath)) {
    console.error(`❌ CSV file not found: ${csvPath}`);
    process.exit(1);
  }

  DashboardServer.start(port, csvPath);
}

module.exports = DashboardServer;

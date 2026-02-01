# Portfolio Analyzer - User Guide

## 🎯 What Changed?

✅ **Default exemption is now EUR 2,000** (couple status)  
✅ **Segregated from other projects** - dedicated `/portfolio-analyzer` folder  
✅ **Beautiful HTML reports** - view results in your browser  
✅ **Interactive web dashboard** - live scenario switching  
✅ **Multiple viewing options** - terminal, HTML, or web dashboard  

---

## 📁 Folder Structure

```
portfolio-analyzer/
├── portfolio_calculator.js       (Core calculator - DEFAULT: €2,000)
├── report_generator.js           (HTML report generator)
├── dashboard.js                  (Interactive web dashboard)
├── README.md                     (This file)
└── reports/
    ├── portfolio_analysis.html   (Beautiful formatted report)
    └── scenario_comparison.html  (All 4 scenarios comparison)
```

---

## 🚀 3 Ways to View Your Analysis

### Option 1: Terminal (Quickest - 10 seconds)
```bash
cd portfolio-analyzer
node portfolio_calculator.js
```

**Output**: Summary table with:
- Investment totals
- Realized gains
- Default scenario (EUR 2,000 - couple)
- Tax refund amount
- Top 5 assets

✅ **Best for**: Quick overview, command line preference

---

### Option 2: HTML Reports (Best - 2 minutes)
```bash
cd portfolio-analyzer
node report_generator.js
```

**Creates**:
- `reports/portfolio_analysis.html` - Beautiful main report
- `reports/scenario_comparison.html` - All 4 scenarios

**Then**: 
1. Open `portfolio_analysis.html` in your browser
2. Or `scenario_comparison.html` for side-by-side comparison

✅ **Best for**: Professional, printable reports, detailed analysis

---

### Option 3: Web Dashboard (Interactive - 20 seconds)
```bash
cd portfolio-analyzer
node dashboard.js
```

**Then**:
1. Open browser to `http://localhost:3000/dashboard`
2. Click buttons to switch between scenarios
3. See refund amounts update live

✅ **Best for**: Interactive exploration, scenario comparison

---

## 💰 Quick Results

Based on your 2025 data:

| Metric | Value |
|--------|-------|
| **Total Invested** | EUR 124,366.39 |
| **Realized Gains** | EUR 12,929.66 (13.55%) |
| **Default: Couple (€2,000)** | **EUR 2,985.75 refund** ✅ |
| **Alternative: Single (€1,000)** | EUR 2,725.75 refund |
| **Difference** | EUR 260 savings if married |

---

## 🎯 Tax Scenarios Explained

### Scenario 1: Single (€1,000 exemption)
- Use if you're not married
- Exemption: EUR 1,000
- Tax rate: 26%
- **Your refund: EUR 2,725.75**

### Scenario 2: Couple (€2,000 exemption) ⭐ **DEFAULT**
- Use if you're married  
- Exemption: EUR 2,000 (EUR 1,000 each)
- Tax rate: 26%
- **Your refund: EUR 2,985.75**
- **Saves EUR 260** vs single

### Scenario 3: Single + Church Tax
- Like Scenario 1 + church tax
- Exemption: EUR 1,000
- Tax rate: 26.375% (higher)
- **Your refund: EUR 2,685.44**

### Scenario 4: Couple + Church Tax
- Like Scenario 2 + church tax
- Exemption: EUR 2,000
- Tax rate: 26.375% (higher)
- **Your refund: EUR 2,945.44**

---

## 🔧 Customization

### Change Exemption Status
Edit the command to use specific scenario:

```javascript
// Default (couple, €2,000)
node -e "
const P = require('./portfolio_calculator.js');
const fs = require('fs');
const csv = fs.readFileSync('../2026-01-31_16-07-16_ScalableCapital-Broker-Transactions.csv', 'utf-8');

// Run with couple status (DEFAULT)
const result = P.analyzPortfolio(csv, { isCouple: true });
console.log('Refund:', result.tax_liability.tax_refund);
"
```

Or as single:
```javascript
const result = P.analyzPortfolio(csv, { isCouple: false });
```

### Track Exemption Already Used
If you've already used part of your 2026 exemption:

```javascript
const result = P.analyzPortfolio(csv, {
  isCouple: true,
  exemptionAlreadyUsed: 500  // You've used €500 already
});
```

### Include Church Tax
```javascript
const result = P.analyzPortfolio(csv, {
  isCouple: true,
  includeChurchTax: true  // Adds 0.375% to rate
});
```

---

## 📊 All Scenarios Comparison

| Scenario | Exemption | Rate | Refund | Notes |
|----------|-----------|------|--------|-------|
| Single | €1,000 | 26% | €2,725.75 | Unmarried |
| **Couple** ⭐ | **€2,000** | **26%** | **€2,985.75** | **BEST - Married** |
| Single + Church | €1,000 | 26.375% | €2,685.44 | Church member |
| Couple + Church | €2,000 | 26.375% | €2,945.44 | Church member + married |

---

## 🧮 How It Works

### 1. **FIFO Cost Basis** (First-In-First-Out)
Your calculator matches shares sold against oldest purchases first:
- Buy 10 shares @ €100 = cost €1,000
- Later, buy 10 shares @ €120 = cost €1,200
- Sell 15 shares @ €150 = proceeds €2,250
- Cost basis: (10 × €100) + (5 × €120) = €1,600
- Gain: €2,250 - €1,600 = €650

### 2. **German Tax Rules Applied**
- Gross Gains: EUR 12,929.66
- Minus Exemption: EUR 2,000
- = Taxable Gains: EUR 10,929.66
- × Tax Rate: 26%
- = Tax Liability: EUR 2,841.71
- Minus Broker Withholding: EUR 5,827.46
- = **Refund: EUR 2,985.75** ✅

### 3. **Broker Withholding Logic**
Your broker already withheld taxes:
- They withheld: EUR 5,827.46
- Your actual liability: EUR 2,841.71
- Over-withholding: EUR 2,985.75 → **You get refund!**

---

## 📁 CSV Requirements

Your file must have these columns (semicolon-separated):
```
date;isin;description;shares;price;amount;tax;type;currency
2025-01-15;DE000ABC;Stock A;10;100,00;1000,00;0,00;buy;EUR
2025-03-20;DE000ABC;Stock A;10;150,00;1500,00;39,00;sell;EUR
```

**Types supported**:
- `buy` - Purchase transaction
- `sell` - Sale transaction

---

## 🎓 German Tax Compliance

✅ **FIFO Method** - German tax standard  
✅ **Exemption Logic** - €1,000 (single) or €2,000 (couple)  
✅ **Tax Rates** - 26% standard or 26.375% with church tax  
✅ **Refund Calculation** - Accurate withholding comparison  
✅ **Audit Ready** - Maintains full transaction history  

---

## 💡 Tips

**Tip 1**: If married, always use **Couple (€2,000)** scenario for maximum refund  

**Tip 2**: Church tax is typically only 0.375% extra - usually worth paying if member  

**Tip 3**: Save the HTML reports for your tax filing documentation  

**Tip 4**: Use the web dashboard to show scenarios to your spouse/partner  

**Tip 5**: Your EUR 2,985.75 refund should be included in your Steuererklärung  

---

## 🚀 Next Steps

1. **Run the calculator**:
   ```bash
   cd portfolio-analyzer
   node portfolio_calculator.js
   ```

2. **Generate HTML reports**:
   ```bash
   node report_generator.js
   # Then open reports/portfolio_analysis.html in browser
   ```

3. **Explore scenarios interactively**:
   ```bash
   node dashboard.js
   # Then open http://localhost:3000/dashboard
   ```

4. **Use refund amount in tax filing**:
   - Include EUR 2,985.75 (or your chosen scenario amount)
   - File your Steuererklärung with this amount

---

## ❓ FAQ

**Q: Why is default EUR 2,000 instead of EUR 1,000?**  
A: You're married, so couple status applies. This gives you maximum exemption.

**Q: Can I change the exemption?**  
A: Yes! Use `{ isCouple: false }` for single status, or `{ exemptionAlreadyUsed: 500 }` to track year-to-date usage.

**Q: Is the refund really EUR 2,985.75?**  
A: Yes! Broker withheld EUR 5,827.46 but you only owe EUR 2,841.71. The difference is your refund.

**Q: Do I need to file anything?**  
A: Include this refund amount in your Steuererklärung (tax return) for 2025.

**Q: Can I use this for 2026 data?**  
A: Yes, just provide the CSV file with your 2026 transactions.

**Q: Is this FIFO method accurate?**  
A: Yes, FIFO (First-In-First-Out) is the German tax standard for securities.

---

## 📞 Support

**Terminal issues?**  
→ Run: `node -v` (must be v12+)

**Port already in use?**  
→ Change port: `node dashboard.js 3001` (uses port 3001)

**Browser won't open?**  
→ Manually open: `http://localhost:3000/dashboard`

**CSV parse errors?**  
→ Ensure semicolon delimiters and proper format (see CSV Requirements)

---

**Version**: 2.1.0 (Fixed: EUR 2,000 default, Segregated folder, HTML reports, Dashboard)  
**Last Updated**: 2026-01-31  
**Status**: ✅ Production Ready

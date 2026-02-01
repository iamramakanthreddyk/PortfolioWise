import React from 'react';

export function About() {
  return (
    <div className="about-container">
      {/* Hero Introduction */}
      <div className="card about-hero">
        <div className="about-header">
          <div className="about-icon">🚀</div>
          <div>
            <h2>About PortfolioWise</h2>
            <p className="about-subtitle">A hobby project for smarter portfolio tax analysis</p>
          </div>
        </div>
        <p className="about-description">
          Created by <strong>Ramakanth Reddy Kowdampalli</strong>, this tool helps Scalable Capital users
          understand their capital gains tax obligations in Germany. Built with ❤️ as a side project
          to make tax season less stressful.
        </p>
      </div>

      {/* Contact Section */}
      <div className="card contact-card">
        <h3>📞 Get In Touch</h3>
        <p className="contact-intro">Have questions, ideas, or want to contribute? I'd love to hear from you!</p>

        <div className="contact-grid">
          <div className="contact-item">
            <div className="contact-icon">📱</div>
            <div className="contact-details">
              <strong>Phone</strong>
              <a href="tel:+491798154968" className="contact-link">+49 179 815 4968</a>
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-icon">✉️</div>
            <div className="contact-details">
              <strong>Email</strong>
              <a href="mailto:kowdampalli.ramakanthreddy@gmail.com" className="contact-link">
                kowdampalli.ramakanthreddy@gmail.com
              </a>
            </div>
          </div>
        </div>

        <div className="cta-section">
          <p><strong>Call or email anytime!</strong> Whether you want to contribute code, suggest features,
          report bugs, or just chat about finance and development.</p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="card faq-card">
        <h3>❓ Frequently Asked Questions</h3>
        <p className="faq-intro">Everything you need to know about PortfolioWise</p>

        <div className="faq-categories">
          <div className="faq-category">
            <h4>🛠️ About the Tool</h4>
            <div className="faq-grid">
              <details className="faq-item">
                <summary>
                  <span className="faq-icon">🎯</span>
                  What exactly does PortfolioWise do?
                </summary>
                <p>PortfolioWise is a smart tax analysis tool that helps German investors understand their capital gains tax obligations. It processes your broker transaction data, applies FIFO (First In, First Out) accounting, and calculates exactly what you owe the Finanzamt - including solidarity surcharge and church tax considerations.</p>
              </details>

              <details className="faq-item">
                <summary>
                  <span className="faq-icon">📊</span>
                  Which brokers are supported?
                </summary>
                <p>Currently optimized for <strong>Scalable Capital</strong> with auto-detection. Generic CSV parsing is available for other brokers. Future updates will add support for Trade212, ING, and other popular German brokers. Let me know if you need a specific broker!</p>
              </details>

              <details className="faq-item">
                <summary>
                  <span className="faq-icon">⚡</span>
                  How fast is the analysis?
                </summary>
                <p>Lightning fast! Most portfolios are analyzed in under 2 seconds. The heavy lifting happens in your browser using optimized algorithms - no waiting for server responses or cloud processing.</p>
              </details>

              <details className="faq-item">
                <summary>
                  <span className="faq-icon">🔄</span>
                  What tax methods are supported?
                </summary>
                <p>Currently implements <strong>FIFO (First In, First Out)</strong> method as required by German tax law. Future versions may include LIFO or average cost methods if tax regulations change. The tool automatically handles the 12-month speculation period rule.</p>
              </details>
            </div>
          </div>

          <div className="faq-category">
            <h4>🔒 Privacy & Security</h4>
            <div className="faq-grid">
              <details className="faq-item">
                <summary>
                  <span className="faq-icon">🛡️</span>
                  Is my financial data safe?
                </summary>
                <p><strong>100% secure!</strong> Everything runs locally in your browser. Your CSV data never leaves your device. No servers, no databases, no cloud storage, no tracking pixels. When you close the tab, all data is gone forever.</p>
              </details>

              <details className="faq-item">
                <summary>
                  <span className="faq-icon">👀</span>
                  Can anyone see my data?
                </summary>
                <p><strong>No one.</strong> Not me, not any company, not any third party. The code is open-source so you can verify this yourself. Your financial privacy is completely protected - this is a core design principle.</p>
              </details>

              <details className="faq-item">
                <summary>
                  <span className="faq-icon">💾</span>
                  Is my data stored anywhere?
                </summary>
                <p><strong>Never.</strong> No local storage, no IndexedDB, no cookies, no cache. Each session is completely isolated. If you want to save results, use the export feature to download reports to your device.</p>
              </details>
            </div>
          </div>

          <div className="faq-category">
            <h4>📋 Using PortfolioWise</h4>
            <div className="faq-grid">
              <details className="faq-item">
                <summary>
                  <span className="faq-icon">🚀</span>
                  How do I get started?
                </summary>
                <div className="usage-steps">
                  <div className="step"><strong>1. Choose Platform:</strong> Select your broker (Scalable auto-detects)</div>
                  <div className="step"><strong>2. Upload CSV:</strong> Drag & drop or click to select your transaction file</div>
                  <div className="step"><strong>3. Configure:</strong> Adjust tax assumptions (couple status, exemptions, etc.)</div>
                  <div className="step"><strong>4. Analyze:</strong> Review summary, filter by date/tax status</div>
                  <div className="step"><strong>5. Export:</strong> Download reports for your tax advisor</div>
                </div>
              </details>

              <details className="faq-item">
                <summary>
                  <span className="faq-icon">📅</span>
                  How do I filter transactions?
                </summary>
                <p>Use the filter panel to narrow down transactions by date range, transaction type (buy/sell/dividend), or tax status. You can also search for specific securities or focus on transactions with tax implications.</p>
              </details>

              <details className="faq-item">
                <summary>
                  <span className="faq-icon">📈</span>
                  What do the insights show?
                </summary>
                <p>The insights highlight key tax events: total taxable gains, losses you can carry forward, exemption utilization, and potential tax savings. It also shows your effective tax rate and compares different scenarios.</p>
              </details>

              <details className="faq-item">
                <summary>
                  <span className="faq-icon">💰</span>
                  How accurate are the tax calculations?
                </summary>
                <p>Very accurate for German tax law! It correctly implements the 25% capital gains tax rate, solidarity surcharge (5.5%), church tax (8-9%), and the €12,000 exemption for couples. Always double-check with a tax professional for your specific situation.</p>
              </details>
            </div>
          </div>

          <div className="faq-category">
            <h4>⚖️ Legal & Tax</h4>
            <div className="faq-grid">
              <details className="faq-item">
                <summary>
                  <span className="faq-icon">📜</span>
                  Is this official tax advice?
                </summary>
                <p><strong>No.</strong> This is a helpful analysis tool, not official tax advice. German tax law can be complex with many exceptions and special cases. Always consult a qualified tax advisor or Steuerberater for your specific tax situation.</p>
              </details>

              <details className="faq-item">
                <summary>
                  <span className="faq-icon">🇩🇪</span>
                  Which tax rules does it follow?
                </summary>
                <p>Implements current German tax law: §20 EStG for capital gains, 12-month speculation period, €12,000 exemption for couples (€6,000 single), solidarity surcharge, and church tax. Updated for 2026 tax year rules.</p>
              </details>

              <details className="faq-item">
                <summary>
                  <span className="faq-icon">🏛️</span>
                  Can I use this for my tax return?
                </summary>
                <p>You can use the analysis to understand your tax situation and prepare for discussions with your tax advisor. The exported reports can be helpful for your Steuerberater, but this tool doesn't generate official tax documents.</p>
              </details>
            </div>
          </div>

          <div className="faq-category">
            <h4>🤝 Contributing & Support</h4>
            <div className="faq-grid">
              <details className="faq-item">
                <summary>
                  <span className="faq-icon">💻</span>
                  Can I contribute to the project?
                </summary>
                <p><strong>Absolutely!</strong> This is open-source and welcomes contributions. Whether you want to add new brokers, improve the UI, fix bugs, enhance tax calculations, or add new features - I'd love your help!</p>
              </details>

              <details className="faq-item">
                <summary>
                  <span className="faq-icon">🚀</span>
                  What's planned for the future?
                </summary>
                <p>More broker support (ING, Trade Republic, etc.), improved tax scenario modeling, PDF report generation, multi-year analysis, and mobile app version. Your feedback shapes the roadmap!</p>
              </details>

              <details className="faq-item">
                <summary>
                  <span className="faq-icon">🐛</span>
                  Found a bug or have a suggestion?
                </summary>
                <p>Perfect! I want to hear about it. Whether it's a calculation error, UI issue, or feature request - reach out immediately. This helps make PortfolioWise better for everyone.</p>
              </details>

              <details className="faq-item">
                <summary>
                  <span className="faq-icon">🌟</span>
                  How can I support the project?
                </summary>
                <p>Share it with fellow investors, contribute code, suggest improvements, or just give feedback. Every contribution helps! If you find it valuable, tell others about it.</p>
              </details>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="card cta-card">
        <h3>🚀 Let's Build Something Great Together</h3>
        <p>PortfolioWise started as a hobby project, but with your help, it can become an even better
        tool for the investing community.</p>

        <div className="cta-buttons">
          <a href="tel:+491798154968" className="cta-button primary">
            📞 Call Me
          </a>
          <a href="mailto:kowdampalli.ramakanthreddy@gmail.com" className="cta-button secondary">
            ✉️ Email Me
          </a>
        </div>

        <p className="cta-footer">
          <em>Questions? Ideas? Contributions? Just reach out - I'm here to help! 🇩🇪</em>
        </p>
      </div>
    </div>
  );
}
import React from 'react';

export function About() {
  return (
    <div className="card">
      <h2>About PortfolioWise</h2>
      <p>This is a hobby project created by <strong>Ramakanth Reddy Kowdampalli</strong> to help Scalable Capital users analyze their portfolio tax implications.</p>

      <h3>Contact Me</h3>
      <p>If you want to contribute, have ideas for improvements, or just want to chat about the project:</p>
      <ul>
        <li><strong>Phone:</strong> +49 1798154968</li>
        <li><strong>Email:</strong> <a href="mailto:kowdampalli.ramakanthreddy@gmail.com">kowdampalli.ramakanthreddy@gmail.com</a></li>
      </ul>
      <p>Feel free to call or email anytime!</p>

      <h3>FAQ / Know-How</h3>
      <details>
        <summary>What is this tool?</summary>
        <p>PortfolioWise helps you upload your broker transaction CSVs, calculate capital gains tax using FIFO method, and understand what tax the German Finanzamt expects from you.</p>
      </details>
      <details>
        <summary>Do we track your data?</summary>
        <p><strong>No!</strong> Everything runs locally in your browser. No data is sent to any server. Your financial data stays private.</p>
      </details>
      <details>
        <summary>How to use?</summary>
        <p>1. Select your broker platform<br/>2. Upload your CSV file<br/>3. Adjust filters and assumptions<br/>4. Review the summary and insights<br/>5. Export reports if needed</p>
      </details>
      <details>
        <summary>Is it accurate?</summary>
        <p>This tool implements German tax rules for capital gains, but always consult a tax professional for your specific situation.</p>
      </details>
      <details>
        <summary>Can I contribute?</summary>
        <p>Absolutely! This is open-source. Reach out if you want to add features, fix bugs, or improve the code.</p>
      </details>

      <h3>Make This Better</h3>
      <p>Have suggestions? Ideas for new features? Bugs to report? Just call or email me. Let's make this tool even more useful!</p>
    </div>
  );
}
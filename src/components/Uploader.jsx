import React from 'react';

export function Uploader({ onLoad }) {
  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    onLoad(text, file.name);
  };

  return (
    <div className="card">
      <h2>Upload CSV</h2>
      <p>Upload your Scalable (or future platform) CSV. Data stays local in your browser.</p>
      <input type="file" accept=".csv,text/csv" onChange={handleFile} />
    </div>
  );
}

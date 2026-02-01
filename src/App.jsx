import React, { useMemo, useState } from 'react';
import { Uploader } from './components/Uploader.jsx';
import { Filters } from './components/Filters.jsx';
import { Assumptions } from './components/Assumptions.jsx';
import { Summary } from './components/Summary.jsx';
import { Derivation } from './components/Derivation.jsx';
import { Insights } from './components/Insights.jsx';
import { DataTable } from './components/DataTable.jsx';
import { Exporter } from './components/Exporter.jsx';
import { parseCsv } from './parsers.js';
import { computeSummary } from './logic.js';
import { normalizeDate } from './utils.js';

export default function App() {
  const [rawRows, setRawRows] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({ key: '', dir: 'asc' });
  const [platform, setPlatform] = useState('auto');
  const [opts, setOpts] = useState({
    isCouple: true,
    exemptionAlreadyUsed: 0,
    includeChurchTax: false,
    brokerAppliedExemption: false,
    baseRatePercent: 25,
    solidarityPercent: 5
  });

  const filtered = useMemo(() => {
    let rows = [...rawRows];
    if (filters.from) rows = rows.filter((r) => normalizeDate(r.date) >= filters.from);
    if (filters.to) rows = rows.filter((r) => normalizeDate(r.date) <= filters.to);
    if (filters.type) rows = rows.filter((r) => (r.type || '').toLowerCase() === filters.type.toLowerCase());
    if (filters.taxOnly === 'positive') rows = rows.filter((r) => (r.tax || 0) > 0);
    if (filters.taxOnly === 'negative') rows = rows.filter((r) => (r.tax || 0) < 0);
    if (sort.key) {
      const dir = sort.dir === 'asc' ? 1 : -1;
      rows.sort((a, b) => {
        const va = a[sort.key];
        const vb = b[sort.key];
        if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * dir;
        return String(va ?? '').localeCompare(String(vb ?? ''), 'de', { numeric: true }) * dir;
      });
    }
    return rows;
  }, [rawRows, filters, sort]);

  const summary = useMemo(() => computeSummary(filtered, opts), [filtered, opts]);

  const handleUpload = (text, filename) => {
    const { rows, headers: h } = parseCsv(text, platform);
    setRawRows(rows);
    setHeaders(h);
    setPage(1);
    // Infer exemption used from zero-tax sells
    const inferred = rows.length > 0 ? require('./logic.js').inferExemptionUsed(rows, opts.isCouple) : 0;
    setOpts((prev) => ({ ...prev, exemptionAlreadyUsed: inferred }));
  };

  const showData = rawRows.length > 0;

  return (
    <div className="container">
      <section className="hero">
        <div className="hero-brand">
          <div className="brand-mark">
            <span>SC</span>
          </div>
          <div>
            <p className="hero-eyebrow">Scalable Capital · Germany</p>
            <h1>Portfolio tax cockpit</h1>
            <p>Upload broker CSVs, audit the withheld tax, and see what the Finanzamt expects in seconds.</p>
          </div>
        </div>
        <div className="hero-meta">
          <span>🔒 Local only</span>
          <span>📄 CSV → insights</span>
          <span>🧮 FIFO-ready logic</span>
        </div>
      </section>

      <div className="card security-card">
        <h2>Security & privacy</h2>
        <p>Everything you upload stays right inside this browser tab. We never store CSVs, summaries, or assumptions on any server.</p>
        <ul>
          <li>Parsing + computations happen fully client-side.</li>
          <li>No cookies, databases, or cloud sync are involved.</li>
          <li>Closing the tab wipes the working data instantly.</li>
        </ul>
      </div>

      <div className="card">
        <h2>Broker Platform</h2>
        <p style={{ marginTop: 4, color: '#475569' }}>Select the platform to guide parsing (auto-detect by default).</p>
        <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
          <option value="auto">Auto-detect</option>
          <option value="scalable">Scalable</option>
          <option value="trade212">Trade212 (future)</option>
          <option value="unknown">Generic CSV</option>
        </select>
      </div>

      <Uploader onLoad={handleUpload} />
      {showData && (
        <>
          <Filters filters={filters} onChange={setFilters} />
          <Assumptions opts={opts} onChange={setOpts} />
          <Summary summary={summary} />
          <Derivation summary={summary} />
          <Insights summary={summary} />
          <Exporter rows={filtered} summary={summary} headers={headers} />
          <DataTable rows={filtered} page={page} pageSize={25} onPage={setPage} headers={headers} sort={sort} onSort={(key) => {
            setSort((prev) => prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' });
            setPage(1);
          }} />
        </>
      )}
    </div>
  );
}

import React from 'react';
import { paginate } from '../utils.js';

export function DataTable({ rows, page, pageSize, onPage, headers, sort, onSort }) {
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const pageRows = paginate(rows, page, pageSize);

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Transactions ({rows.length})</h2>
        <div className="badge">Page {page} / {totalPages}</div>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              {headers.map((h) => (
                <th key={h} onClick={() => onSort(h)} style={{ cursor: 'pointer', userSelect: 'none' }}>
                  {h} {sort.key === h ? (sort.dir === 'asc' ? '▲' : '▼') : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row, idx) => (
              <tr key={idx}>
                {headers.map((h) => <td key={h}>{formatCell(row, h)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
        <button onClick={() => onPage(Math.max(1, page - 1))} disabled={page === 1}>Prev</button>
        <button onClick={() => onPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}>Next</button>
      </div>
    </div>
  );
}

function formatCell(row, key) {
  const value = row[key];
  if (value === undefined || value === null) return '';
  if (typeof value === 'number') return value.toLocaleString('de-DE');
  return String(value);
}

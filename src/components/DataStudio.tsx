import React, { useState } from 'react';
import { AdvertisingRecord } from '../types/sales';
import { parseCsvRows, BENCHMARK_RAW_CSV } from '../data/benchmarkData';

interface DataStudioProps {
  records: AdvertisingRecord[];
  onDatasetUpdate: (newRecords: AdvertisingRecord[], name: string) => void;
  datasetName: string;
}

export const DataStudio: React.FC<DataStudioProps> = ({
  records,
  onDatasetUpdate,
  datasetName
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const filtered = records.filter(r =>
    r.id.toString().includes(searchTerm) ||
    r.TV.toString().includes(searchTerm) ||
    r.Radio.toString().includes(searchTerm) ||
    r.Newspaper.toString().includes(searchTerm) ||
    r.Sales.toString().includes(searchTerm)
  );

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const currentRows = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const parsed = parseCsvRows(text);
        if (parsed.length > 0) {
          onDatasetUpdate(parsed, file.name);
          setPage(1);
        } else {
          alert('Could not parse valid numerical records with TV, Radio, Newspaper, Sales from the CSV.');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleDownloadCsv = () => {
    const blob = new Blob([BENCHMARK_RAW_CSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'advertising_sales_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRestoreBenchmark = () => {
    const parsed = parseCsvRows(BENCHMARK_RAW_CSV);
    onDatasetUpdate(parsed, 'ISLR Benchmark Dataset');
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="brutal-panel p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Dataset Records
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Active: <span className="text-slate-900 font-mono font-bold">{datasetName}</span> ({records.length} records)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="mech-btn px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer">
            <span>Upload CSV</span>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <button
            onClick={handleDownloadCsv}
            className="mech-btn px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
          >
            <span>Download CSV</span>
          </button>

          {datasetName !== 'ISLR Benchmark Dataset' && (
            <button
              onClick={handleRestoreBenchmark}
              className="mech-btn px-4 py-2 font-mono text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-2 cursor-pointer"
            >
              <span>Reset Benchmark</span>
            </button>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="brutal-panel overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 border-b-2 border-[#0f172a] flex flex-wrap items-center justify-between gap-4 bg-[#e2e8f0]">
          <div className="neu-bay px-3 py-2 w-72 flex items-center rounded">
            <input
              type="text"
              placeholder="Search values..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="bg-transparent text-xs text-slate-900 placeholder-slate-500 focus:outline-none w-full font-mono"
            />
          </div>

          <div className="text-xs text-slate-600 font-mono font-bold">
            {filtered.length} rows total
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-[#e2e8f0] border-b-2 border-[#0f172a] text-xs font-mono text-slate-700 uppercase tracking-wider">
                <th className="py-3 px-5 w-20">Market ID</th>
                <th className="py-3 px-5 text-right">TV ($k)</th>
                <th className="py-3 px-5 text-right">Radio ($k)</th>
                <th className="py-3 px-5 text-right">Newspaper ($k)</th>
                <th className="py-3 px-5 text-right font-bold text-amber-700">Sales (1k Units)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#cbd5e1]">
              {currentRows.map((r) => (
                <tr key={r.id} className="hover:bg-slate-100 text-slate-800 transition-colors">
                  <td className="py-3.5 px-5 font-mono text-slate-500">#{r.id}</td>
                  <td className="py-3.5 px-5 text-right font-mono tabular-nums text-slate-900">${r.TV.toFixed(1)}k</td>
                  <td className="py-3.5 px-5 text-right font-mono tabular-nums text-slate-900">${r.Radio.toFixed(1)}k</td>
                  <td className="py-3.5 px-5 text-right font-mono tabular-nums text-slate-900">${r.Newspaper.toFixed(1)}k</td>
                  <td className="py-3.5 px-5 text-right font-mono tabular-nums font-bold text-amber-700">
                    {r.Sales.toFixed(1)}k
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Toolbar */}
        <div className="p-4 border-t-2 border-[#0f172a] flex items-center justify-between bg-[#e2e8f0]">
          <span className="text-xs font-mono text-slate-700 font-bold">
            Page {page} of {Math.max(1, totalPages)}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="mech-btn px-3 py-1.5 font-mono text-xs uppercase disabled:opacity-40 cursor-pointer"
            >
              Prev
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="mech-btn px-3 py-1.5 font-mono text-xs uppercase disabled:opacity-40 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

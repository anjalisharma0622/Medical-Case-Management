import React, { useState } from 'react';
import { CODEBASE_FILES, CodeFile } from '../data/codebaseFiles';
import { FileCode, Copy, Check, Folder } from 'lucide-react';

export const CodeExplorer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<CodeFile>(CODEBASE_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchFilter, setSearchFilter] = useState('');

  const categories = ['All', 'Documentation', 'Models & Policies', 'Controllers & API', 'Requests & Resources', 'Migrations & Seeders', 'Blade Views', 'Tests & Config'];

  const filteredFiles = CODEBASE_FILES.filter(file => {
    const matchesCat = selectedCategory === 'All' || file.category === selectedCategory;
    const matchesSearch = !searchFilter || file.path.toLowerCase().includes(searchFilter.toLowerCase()) || file.description.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Laravel Project Codebase &amp; Architecture</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Production Laravel 11 structure: Models, Policies, Form Requests, Seeders, Migrations, Blade views, and Feature Tests.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition whitespace-nowrap ${selectedCategory === cat ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {cat}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={searchFilter}
          onChange={e => setSearchFilter(e.target.value)}
          placeholder="Filter file by path..."
          className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs w-full sm:w-64 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white"
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[550px]">
        {/* File Directory */}
        <div className="lg:col-span-4 border border-slate-200 rounded-xl overflow-hidden flex flex-col bg-slate-50/50">
          <div className="p-3 bg-slate-100/70 border-b border-slate-200 font-semibold text-xs text-slate-700 flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <Folder className="w-3.5 h-3.5 text-teal-600" />
              <span>Project Files ({filteredFiles.length})</span>
            </span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">PSR-4</span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 max-h-[520px]">
            {filteredFiles.map(file => (
              <button
                key={file.path}
                onClick={() => setSelectedFile(file)}
                className={`w-full text-left p-2.5 transition flex items-start space-x-2 text-xs ${selectedFile.path === file.path ? 'bg-white shadow-xs font-semibold text-teal-800 border-l-3 border-teal-600' : 'hover:bg-slate-100 text-slate-700'}`}>
                <FileCode className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${selectedFile.path === file.path ? 'text-teal-600' : 'text-slate-400'}`} />
                <div className="min-w-0 flex-1">
                  <div className="font-mono text-[11px] truncate">{file.path}</div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">{file.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Code Viewer */}
        <div className="lg:col-span-8 border border-slate-200 rounded-xl overflow-hidden flex flex-col bg-slate-950 text-slate-100">
          <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 font-mono">
              <span className="text-teal-400 font-bold">{selectedFile.path}</span>
              <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 uppercase">{selectedFile.language}</span>
            </div>
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 text-xs font-medium flex items-center space-x-1 transition cursor-pointer">
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="p-4 flex-1 overflow-auto font-mono text-xs leading-relaxed max-h-[520px] bg-slate-950">
            <pre className="text-teal-300 whitespace-pre-wrap">{selectedFile.content}</pre>
          </div>

          <div className="p-2.5 bg-slate-900 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between px-4">
            <span>{selectedFile.description}</span>
            <span className="font-mono text-slate-500">{selectedFile.content.split('\n').length} lines</span>
          </div>
        </div>
      </div>
    </div>
  );
};

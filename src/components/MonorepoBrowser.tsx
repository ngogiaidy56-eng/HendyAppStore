/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Folder,
  FolderOpen,
  FileCode,
  Copy,
  Check,
  Download,
  Search,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Layers,
} from 'lucide-react';
import { MONOREPO_FILES, VirtualFile } from '../core/monorepoFiles';

export const MonorepoBrowser: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<VirtualFile>(MONOREPO_FILES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const filteredFiles = MONOREPO_FILES.filter(
    (f) =>
      f.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([selectedFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              FULL MONOREPO DIRECTORY
            </span>
            <span className="text-xs text-slate-400 font-mono">HendyAppStore/</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Cấu Trúc Thư Mục & Mã Nguồn Toàn Dự Án Monorepo
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Khám phá chi tiết toàn bộ mã nguồn của các phân hệ: CI/CD Workflows, Adaptive UI (User & Admin), Cloudflare Pages Functions, Serverless Workers, Shared Types & D1 Database.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadFile}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            Tải File Này ({selectedFile.name})
          </button>
        </div>
      </div>

      {/* Explorer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* File Tree (4 cols) */}
        <div className="lg:col-span-4 rounded-3xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-xl">
          <div className="mb-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm kiếm tệp trong monorepo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="text-[11px] text-slate-400 uppercase tracking-wider mb-2 font-semibold">
            Danh sách tệp ({filteredFiles.length} files)
          </div>

          <div className="space-y-1 max-h-[600px] overflow-y-auto pr-1">
            {filteredFiles.map((file) => {
              const isSelected = selectedFile.path === file.path;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left p-2.5 rounded-xl transition flex items-center gap-2.5 text-xs font-mono ${
                    isSelected
                      ? 'bg-indigo-600/30 text-white border border-indigo-500/50'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <FileCode
                    className={`w-4 h-4 shrink-0 ${
                      file.extension === 'yml'
                        ? 'text-pink-400'
                        : file.extension === 'tsx' || file.extension === 'ts'
                        ? 'text-sky-400'
                        : file.extension === 'sql'
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold truncate">{file.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{file.path}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Code Content View (8 cols) */}
        <div className="lg:col-span-8 rounded-3xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-xl flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4 flex-wrap gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-indigo-400 font-bold">
                  {selectedFile.path}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                  {selectedFile.extension.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">{selectedFile.description}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Đã sao chép' : 'Sao Chép Mã'}
              </button>
            </div>
          </div>

          {/* Syntax Code Display */}
          <div className="flex-1 rounded-2xl bg-slate-950 border border-slate-800/90 p-4 font-mono text-xs overflow-x-auto max-h-[580px]">
            <pre className="text-slate-200 leading-relaxed whitespace-pre font-mono">
              {selectedFile.content}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

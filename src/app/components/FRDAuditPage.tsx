import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Clock, FileCheck, FileSpreadsheet } from 'lucide-react';
import { FRDAuditInput } from './FRDAuditInput';
import { FRDAudit, AuditData } from './FRDAudit';
import { toast } from 'sonner';

interface FRDAuditPageProps {
  onBack: () => void;
  onSubmit: (file: File) => void;
  auditData: AuditData | null;
}

interface HistoryItem {
  id: number;
  auditData: AuditData;
}

const STORAGE_KEY = 'zapm-frd-history';

function loadHistory(): HistoryItem[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}

function saveHistory(items: HistoryItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, 10)));
}

export function FRDAuditPage({ onBack, onSubmit, auditData }: FRDAuditPageProps) {
  const [showInput, setShowInput] = useState(!auditData);
  const [history, setHistory] = useState<HistoryItem[]>(loadHistory);
  const [displayedAudit, setDisplayedAudit] = useState<AuditData | null>(auditData);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Sync incoming auditData prop (new audit just completed)
  useEffect(() => {
    if (!auditData) return;
    setDisplayedAudit(auditData);
    setSelectedId(null);

    setHistory(prev => {
      // Avoid duplicates within the same session
      if (prev.length > 0 && prev[0].auditData.fileName === auditData.fileName &&
          prev[0].auditData.analyzedDate === auditData.analyzedDate) return prev;
      const newItem: HistoryItem = { id: Date.now(), auditData };
      const updated = [newItem, ...prev];
      saveHistory(updated);
      return updated;
    });
  }, [auditData]);

  const handleSubmit = (file: File) => {
    onSubmit(file);
    setShowInput(false);
    setSelectedId(null);
  };

  const handleHistoryClick = (item: HistoryItem) => {
    setSelectedId(item.id);
    setDisplayedAudit(item.auditData);
    setShowInput(false);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* History Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back to Home</span>
          </button>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-lime-600 rounded-lg flex items-center justify-center">
              <FileCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">FRD Audit</h2>
              <p className="text-xs text-gray-500">Analyzer</p>
            </div>
          </div>
          <button
            onClick={() => setShowInput(true)}
            className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-lime-600 text-white rounded-lg hover:from-green-700 hover:to-lime-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Upload New FRD
          </button>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex items-center gap-2 mb-4 px-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <h3 className="text-sm font-medium text-gray-700">Recent Audits</h3>
          </div>
          {history.length === 0 ? (
            <p className="text-xs text-gray-400 px-2">No audits run yet.</p>
          ) : (
            <div className="space-y-2">
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleHistoryClick(item)}
                  className={`p-4 rounded-lg cursor-pointer transition-all border ${
                    selectedId === item.id
                      ? 'bg-green-50 border-green-300 shadow-sm'
                      : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      selectedId === item.id ? 'bg-green-200' : 'bg-green-100'
                    }`}>
                      <FileSpreadsheet className={`w-4 h-4 ${
                        selectedId === item.id ? 'text-green-700' : 'text-green-600'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-medium mb-1 truncate ${
                        selectedId === item.id ? 'text-green-900' : 'text-gray-900'
                      }`}>
                        {item.auditData.fileName}
                      </h4>
                      <p className="text-xs text-gray-500 mb-2">{item.auditData.analyzedDate}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs px-2 py-1 rounded border ${
                          selectedId === item.id
                            ? 'text-green-700 bg-white border-green-200'
                            : 'text-gray-600 bg-white border-gray-200'
                        }`}>
                          {item.auditData.totalUseCases} use cases
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          item.auditData.summary.critical > 0
                            ? 'bg-red-50 text-red-600 border border-red-200'
                            : 'bg-green-50 text-green-600 border border-green-200'
                        }`}>
                          {item.auditData.issues.length} issues
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        {showInput ? (
          <div className="max-w-3xl mx-auto p-8">
            <FRDAuditInput
              onSubmit={handleSubmit}
              onClose={() => {
                setShowInput(false);
                if (!displayedAudit) {
                  onBack();
                }
              }}
            />
          </div>
        ) : displayedAudit ? (
          <div className="max-w-5xl mx-auto p-8">
            <FRDAudit
              data={displayedAudit}
              onUpdate={(updatedData) => {
                setDisplayedAudit(updatedData);
                // Persist the updated issue statuses back to history
                setHistory(prev => {
                  const updated = prev.map(h =>
                    h.auditData.fileName === updatedData.fileName &&
                    h.auditData.analyzedDate === updatedData.analyzedDate
                      ? { ...h, auditData: updatedData }
                      : h
                  );
                  saveHistory(updated);
                  return updated;
                });
                toast.success('Audit updated');
              }}
              onShare={() => {
                toast.success('Shared audit report via Zoho Cliq!');
              }}
              onDownload={() => {
                toast.success('Downloading audit report...');
              }}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileCheck className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No FRD Selected
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Upload a new FRD or select from history
              </p>
              <button
                onClick={() => setShowInput(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Upload New FRD
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

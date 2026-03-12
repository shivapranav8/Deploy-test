import React, { useState } from 'react';
import { Download, Share2, Edit2, Save, X, ExternalLink, Users, AlertCircle } from 'lucide-react';

export interface SupportTicketData {
  title: string;
  problemStatement: string;
  whoAreWeSolvingFor: string[];
  prdContent: string;
  proofLink: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  category: string;
  fileName: string;
}

interface SupportTicketProps {
  data: SupportTicketData;
  onUpdate: (data: SupportTicketData) => void;
  onShare: () => void;
  onDownload: () => void;
}

export function SupportTicket({ data, onUpdate, onShare, onDownload }: SupportTicketProps) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const startEdit = (field: string, value: string) => {
    setEditingField(field);
    setEditValue(value);
  };

  const saveEdit = (field: keyof SupportTicketData) => {
    onUpdate({ ...data, [field]: editValue });
    setEditingField(null);
  };

  const cancelEdit = () => {
    setEditingField(null);
    setEditValue('');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'text-red-700 bg-red-100 border-red-300';
      case 'High':
        return 'text-orange-700 bg-orange-100 border-orange-300';
      case 'Medium':
        return 'text-yellow-700 bg-yellow-100 border-yellow-300';
      case 'Low':
        return 'text-green-700 bg-green-100 border-green-300';
      default:
        return 'text-gray-700 bg-gray-100 border-gray-300';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            {editingField === 'title' ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full text-2xl px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => saveEdit('title')}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors flex items-center gap-1"
                  >
                    <Save className="w-3 h-3" />
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50 transition-colors flex items-center gap-1"
                  >
                    <X className="w-3 h-3" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <h2 className="text-2xl text-gray-900 flex-1">{data.title}</h2>
                <button
                  onClick={() => startEdit('title', data.title)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors mt-1"
                >
                  <Edit2 className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            )}
            <div className="flex items-center gap-3 mt-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(data.priority)}`}>
                {data.priority} Priority
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                {data.category}
              </span>
              <span className="text-sm text-gray-500">From: {data.fileName}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={onDownload}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={onShare}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share via Cliq
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Problem Statement */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <h3 className="text-lg font-medium text-gray-900">Problem Statement</h3>
            </div>
            {editingField !== 'problemStatement' && (
              <button
                onClick={() => startEdit('problemStatement', data.problemStatement)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <Edit2 className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
          {editingField === 'problemStatement' ? (
            <div className="space-y-2">
              <textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => saveEdit('problemStatement')}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors flex items-center gap-1"
                >
                  <Save className="w-3 h-3" />
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50 transition-colors flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-gray-800 leading-relaxed">{data.problemStatement}</p>
            </div>
          )}
        </div>

        {/* Who Are We Solving For */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-medium text-gray-900">Who Are We Solving For</h3>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <ul className="space-y-2">
              {data.whoAreWeSolvingFor.map((user, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-gray-800">{user}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* PRD Content */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-medium text-gray-900">PRD Content</h3>
            {editingField !== 'prdContent' && (
              <button
                onClick={() => startEdit('prdContent', data.prdContent)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <Edit2 className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
          {editingField === 'prdContent' ? (
            <div className="space-y-2">
              <textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[200px] font-mono text-sm"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => saveEdit('prdContent')}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors flex items-center gap-1"
                >
                  <Save className="w-3 h-3" />
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50 transition-colors flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">
                {data.prdContent}
              </pre>
            </div>
          )}
        </div>

        {/* Proof Link */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-medium text-gray-900">Proof Link</h3>
            {editingField !== 'proofLink' && (
              <button
                onClick={() => startEdit('proofLink', data.proofLink)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <Edit2 className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
          {editingField === 'proofLink' ? (
            <div className="space-y-2">
              <input
                type="url"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://..."
              />
              <div className="flex gap-2">
                <button
                  onClick={() => saveEdit('proofLink')}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors flex items-center gap-1"
                >
                  <Save className="w-3 h-3" />
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50 transition-colors flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <a
              href={data.proofLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors group"
            >
              <ExternalLink className="w-5 h-5 text-blue-600" />
              <span className="text-blue-700 group-hover:underline break-all">{data.proofLink}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

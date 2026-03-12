import React, { useState } from 'react';
import { Copy, Check, Download, Share2, MessageSquare, FileText } from 'lucide-react';

export interface CommunityTicketData {
  ticketTitle: string;
  issueDescription: string;
  reproductionSteps: string[];
  expectedBehavior: string;
  actualBehavior: string;
  environment: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
}

interface CommunityTicketProps {
  data: CommunityTicketData;
  onShare: () => void;
}

export function CommunityTicket({ data, onShare }: CommunityTicketProps) {
  const [copied, setCopied] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const handleCopy = () => {
    const ticketContent = `${data.ticketTitle}
${'='.repeat(data.ticketTitle.length)}

ISSUE DESCRIPTION
-----------------
${data.issueDescription}

STEPS TO REPRODUCE
------------------
${data.reproductionSteps.map((step, i) => `${i + 1}. ${step}`).join('\n')}

EXPECTED BEHAVIOR
-----------------
${data.expectedBehavior}

ACTUAL BEHAVIOR
---------------
${data.actualBehavior}

ENVIRONMENT
-----------
${data.environment}

PRIORITY: ${data.priority.toUpperCase()}
CATEGORY: ${data.category}

---
Generated on: ${new Date().toLocaleString()}`;

    navigator.clipboard.writeText(ticketContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ticketContent = `${data.ticketTitle}
${'='.repeat(data.ticketTitle.length)}

ISSUE DESCRIPTION
-----------------
${data.issueDescription}

STEPS TO REPRODUCE
------------------
${data.reproductionSteps.map((step, i) => `${i + 1}. ${step}`).join('\n')}

EXPECTED BEHAVIOR
-----------------
${data.expectedBehavior}

ACTUAL BEHAVIOR
---------------
${data.actualBehavior}

ENVIRONMENT
-----------
${data.environment}

PRIORITY: ${data.priority.toUpperCase()}
CATEGORY: ${data.category}

---
Generated on: ${new Date().toLocaleString()}`;

    const blob = new Blob([ticketContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `community-ticket-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl text-gray-900 mb-1">Community Support Ticket</h2>
            <p className="text-sm text-gray-600">Generated ticket ready to post</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </button>
            <button
              onClick={handleDownload}
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
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Title and Priority */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-2xl text-gray-900">{data.ticketTitle}</h3>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                data.priority
              )}`}
            >
              {data.priority.toUpperCase()}
            </span>
          </div>
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-md">
            {data.category}
          </span>
        </div>

        {/* Issue Description */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-600" />
            Issue Description
          </h4>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {data.issueDescription}
          </p>
        </div>

        {/* Steps to Reproduce */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-900 mb-3">Steps to Reproduce</h4>
          <ol className="space-y-2">
            {data.reproductionSteps.map((step, index) => (
              <li key={index} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </span>
                <span className="text-sm text-gray-700 pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Expected vs Actual Behavior */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Expected Behavior */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-green-900 mb-2">Expected Behavior</h4>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{data.expectedBehavior}</p>
          </div>

          {/* Actual Behavior */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-red-900 mb-2">Actual Behavior</h4>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{data.actualBehavior}</p>
          </div>
        </div>

        {/* Environment */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-purple-900 mb-2">Environment</h4>
          <p className="text-sm text-gray-700 whitespace-pre-wrap font-mono">{data.environment}</p>
        </div>

        {/* Footer Note */}
        <div className="text-xs text-gray-500 text-center pt-4 border-t border-gray-200">
          Generated on {new Date().toLocaleString()}
        </div>
      </div>
    </div>
  );
}

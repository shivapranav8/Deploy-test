import React from 'react';
import { FileCode, Check, X, Lock, Download } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export interface FRDData {
  version: number;
  featureName: string;
  functionalRequirements: Array<{ id: string; requirement: string; priority: string }>;
  userFlows: Array<{ name: string; steps: string[] }>;
  apiDataNeeds: Array<{ endpoint: string; method: string; purpose: string }>;
  nonFunctionalRequirements: string[];
  status: 'draft' | 'pending' | 'approved' | 'locked';
}

interface FRDDocumentProps {
  data: FRDData;
  onUpdate: (data: FRDData) => void;
  onApprove: () => void;
  onRequestChanges: () => void;
}

export function FRDDocument({
  data,
  onUpdate,
  onApprove,
  onRequestChanges,
}: FRDDocumentProps) {
  const isLocked = data.status === 'approved' || data.status === 'locked';

  const handleDownload = () => {
    let content = `# FUNCTIONAL REQUIREMENTS DOCUMENT (FRD)\n\n`;
    content += `**Feature:** ${data.featureName}\n`;
    content += `**Version:** ${data.version}\n`;
    content += `**Status:** ${data.status}\n`;
    content += `**Generated:** ${new Date().toLocaleDateString()}\n\n`;
    content += `---\n\n`;
    
    content += `## FUNCTIONAL REQUIREMENTS\n\n`;
    data.functionalRequirements.forEach(req => {
      content += `**${req.id}** [${req.priority}]\n`;
      content += `${req.requirement}\n\n`;
    });
    
    content += `## USER FLOWS\n\n`;
    data.userFlows.forEach(flow => {
      content += `### ${flow.name}\n`;
      flow.steps.forEach((step, i) => {
        content += `${i + 1}. ${step}\n`;
      });
      content += '\n';
    });
    
    content += `## API & DATA REQUIREMENTS\n\n`;
    data.apiDataNeeds.forEach(api => {
      content += `**${api.method}** \`${api.endpoint}\`\n`;
      content += `${api.purpose}\n\n`;
    });
    
    content += `## NON-FUNCTIONAL REQUIREMENTS\n\n`;
    data.nonFunctionalRequirements.forEach(nfr => content += `- ${nfr}\n`);
    
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FRD-${data.featureName.replace(/\s+/g, '-')}-v${data.version}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <FileCode className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <h2 className="text-xl text-gray-900">{data.featureName}</h2>
              <p className="text-sm text-gray-600 mt-1">
                Functional Requirements Document
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <span className="text-xs text-gray-500">v{data.version}</span>
            <StatusBadge status={data.status} />
            {isLocked && <Lock className="w-4 h-4 text-blue-600" />}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-8">
        {/* Functional Requirements */}
        <section>
          <h3 className="text-gray-900 mb-3">Functional Requirements</h3>
          <div className="space-y-2">
            {data.functionalRequirements.map((req) => (
              <div
                key={req.id}
                className="border border-gray-200 rounded-lg p-3 flex items-start justify-between"
              >
                <div className="flex-1">
                  <span className="text-xs text-gray-500 mr-2">{req.id}</span>
                  <span className="text-sm text-gray-700">{req.requirement}</span>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    req.priority === 'High'
                      ? 'bg-red-100 text-red-700'
                      : req.priority === 'Medium'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {req.priority}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* User Flows */}
        <section className="border-t border-gray-200 pt-6">
          <h3 className="text-gray-900 mb-3">User Flows</h3>
          <div className="space-y-4">
            {data.userFlows.map((flow, idx) => (
              <div key={idx} className="border-l-4 border-blue-300 pl-4">
                <h4 className="text-sm text-gray-900 mb-2">{flow.name}</h4>
                <ol className="space-y-1">
                  {flow.steps.map((step, i) => (
                    <li key={i} className="text-sm text-gray-700">
                      {i + 1}. {step}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>

        {/* API & Data Needs */}
        <section className="border-t border-gray-200 pt-6">
          <h3 className="text-gray-900 mb-3">API & Data Requirements</h3>
          <div className="space-y-2">
            {data.apiDataNeeds.map((api, idx) => (
              <div
                key={idx}
                className="bg-gray-50 border border-gray-200 rounded p-3"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                    {api.method}
                  </span>
                  <code className="text-xs text-gray-700">{api.endpoint}</code>
                </div>
                <p className="text-xs text-gray-600">{api.purpose}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Non-Functional Requirements */}
        <section className="border-t border-gray-200 pt-6">
          <h3 className="text-gray-900 mb-3">Non-Functional Requirements</h3>
          <ul className="space-y-2">
            {data.nonFunctionalRequirements.map((nfr, idx) => (
              <li key={idx} className="text-sm text-gray-700 flex gap-2">
                <span className="text-blue-500">•</span>
                <span>{nfr}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Actions */}
      {!isLocked && (
        <div className="border-t border-gray-200 bg-gray-50 p-4 flex gap-3">
          <button
            onClick={onApprove}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            Approve FRD
          </button>
          <button
            onClick={onRequestChanges}
            className="px-4 py-2 border border-orange-300 bg-orange-50 text-orange-700 rounded-md hover:bg-orange-100 transition-colors flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Request Changes
          </button>
        </div>
      )}
    </div>
  );
}
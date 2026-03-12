import React from 'react';
import { Download, Share2, FileSpreadsheet, CheckCircle } from 'lucide-react';

export interface PRDExcelData {
  productName: string;
  version: string;
  overview: string;
  objectives: string[];
  targetUsers: string[];
  features: {
    name: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    effort: string;
  }[];
  requirements: {
    category: string;
    requirement: string;
    priority: 'high' | 'medium' | 'low';
  }[];
  timeline: {
    phase: string;
    duration: string;
    deliverables: string;
  }[];
}

interface PRDExcelProps {
  data: PRDExcelData;
  onShare: () => void;
}

export function PRDExcel({ data, onShare }: PRDExcelProps) {
  const handleDownload = () => {
    // Create CSV content for Excel compatibility
    let csvContent = '';

    // Header
    csvContent += `Product Requirements Document\n`;
    csvContent += `Product Name:,${data.productName}\n`;
    csvContent += `Version:,${data.version}\n`;
    csvContent += `Generated:,${new Date().toLocaleString()}\n`;
    csvContent += `\n`;

    // Overview
    csvContent += `OVERVIEW\n`;
    csvContent += `${data.overview}\n`;
    csvContent += `\n`;

    // Objectives
    csvContent += `OBJECTIVES\n`;
    data.objectives.forEach((obj, i) => {
      csvContent += `${i + 1},${obj}\n`;
    });
    csvContent += `\n`;

    // Target Users
    csvContent += `TARGET USERS\n`;
    data.targetUsers.forEach((user, i) => {
      csvContent += `${i + 1},${user}\n`;
    });
    csvContent += `\n`;

    // Features
    csvContent += `FEATURES\n`;
    csvContent += `Feature Name,Description,Priority,Effort\n`;
    data.features.forEach((feature) => {
      csvContent += `"${feature.name}","${feature.description}",${feature.priority},${feature.effort}\n`;
    });
    csvContent += `\n`;

    // Requirements
    csvContent += `REQUIREMENTS\n`;
    csvContent += `Category,Requirement,Priority\n`;
    data.requirements.forEach((req) => {
      csvContent += `"${req.category}","${req.requirement}",${req.priority}\n`;
    });
    csvContent += `\n`;

    // Timeline
    csvContent += `TIMELINE\n`;
    csvContent += `Phase,Duration,Deliverables\n`;
    data.timeline.forEach((phase) => {
      csvContent += `"${phase.phase}","${phase.duration}","${phase.deliverables}"\n`;
    });

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PRD-${data.productName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl text-gray-900 mb-1">Product Requirements Document</h2>
            <p className="text-sm text-gray-600">Ready to download as Excel/CSV</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Excel
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
        {/* Product Info */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <FileSpreadsheet className="w-8 h-8 text-indigo-600" />
            <div>
              <h3 className="text-2xl text-gray-900">{data.productName}</h3>
              <p className="text-sm text-gray-600">Version {data.version}</p>
            </div>
          </div>
          <div className="bg-white rounded-md p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Overview</h4>
            <p className="text-sm text-gray-700 leading-relaxed">{data.overview}</p>
          </div>
        </div>

        {/* Objectives */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-indigo-600" />
            Objectives
          </h4>
          <div className="space-y-2">
            {data.objectives.map((obj, index) => (
              <div key={index} className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
                <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </span>
                <span className="text-sm text-gray-700 pt-0.5">{obj}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Target Users */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Target Users</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.targetUsers.map((user, index) => (
              <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-gray-700">{user}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Features</h4>
          <div className="space-y-3">
            {data.features.map((feature, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h5 className="font-medium text-gray-900">{feature.name}</h5>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(feature.priority)}`}>
                      {feature.priority}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {feature.effort}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Requirements */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h4>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Category</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Requirement</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Priority</th>
                </tr>
              </thead>
              <tbody>
                {data.requirements.map((req, index) => (
                  <tr key={index} className="border-t border-gray-200">
                    <td className="px-4 py-3 text-sm text-gray-900">{req.category}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{req.requirement}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(req.priority)}`}>
                        {req.priority}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Timeline */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Timeline</h4>
          <div className="space-y-3">
            {data.timeline.map((phase, index) => (
              <div key={index} className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h5 className="font-medium text-gray-900">{phase.phase}</h5>
                  <span className="px-3 py-1 bg-purple-600 text-white rounded-md text-xs font-medium">
                    {phase.duration}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{phase.deliverables}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Download Reminder */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <Download className="w-5 h-5 text-green-600" />
          <div>
            <p className="text-sm font-medium text-green-900">Ready to Download</p>
            <p className="text-xs text-green-700">Click "Download Excel" to get your PRD as a CSV file that opens in Excel</p>
          </div>
        </div>
      </div>
    </div>
  );
}

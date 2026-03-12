import React, { useState } from 'react';
import { FileText, Edit2, Check, X, Lock, Download } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export interface MRDData {
  version: number;
  featureName: string;
  objectives: string[];
  personas: Array<{ name: string; description: string; needs: string[] }>;
  useCases: Array<{ title: string; description: string }>;
  successMetrics: string[];
  constraints: string[];
  zohoImplementation: {
    dataSources: string[];
    schema: Array<{ table: string; fields: string[] }>;
    kpis: string[];
    dashboards: string[];
    permissions: string[];
    architecture: string;
  };
  status: 'draft' | 'pending' | 'approved' | 'locked';
}

interface MRDDocumentProps {
  data: MRDData;
  onUpdate: (data: MRDData) => void;
  onApprove: () => void;
  onRequestChanges: () => void;
}

export function MRDDocument({
  data,
  onUpdate,
  onApprove,
  onRequestChanges,
}: MRDDocumentProps) {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const isLocked = data.status === 'approved' || data.status === 'locked';

  const startEdit = (section: string, currentValue: string) => {
    if (isLocked) return;
    setIsEditing(section);
    setEditValue(currentValue);
  };

  const saveEdit = (section: string) => {
    // Update logic would go here
    setIsEditing(null);
  };

  const cancelEdit = () => {
    setIsEditing(null);
    setEditValue('');
  };

  const handleDownload = () => {
    let content = `# MARKET REQUIREMENTS DOCUMENT (MRD)\n\n`;
    content += `**Feature:** ${data.featureName}\n`;
    content += `**Version:** ${data.version}\n`;
    content += `**Status:** ${data.status}\n`;
    content += `**Generated:** ${new Date().toLocaleDateString()}\n\n`;
    content += `---\n\n`;
    
    content += `## OBJECTIVES\n\n`;
    data.objectives.forEach(obj => content += `- ${obj}\n`);
    
    content += `\n## USER PERSONAS\n\n`;
    data.personas.forEach(persona => {
      content += `### ${persona.name}\n`;
      content += `${persona.description}\n\n`;
      content += `**Key Needs:**\n`;
      persona.needs.forEach(need => content += `- ${need}\n`);
      content += '\n';
    });
    
    content += `## USE CASES\n\n`;
    data.useCases.forEach(useCase => {
      content += `### ${useCase.title}\n`;
      content += `${useCase.description}\n\n`;
    });
    
    content += `## SUCCESS METRICS\n\n`;
    data.successMetrics.forEach(metric => content += `- ${metric}\n`);
    
    content += `\n## ZOHO ANALYTICS IMPLEMENTATION\n\n`;
    content += `### Data Sources\n`;
    data.zohoImplementation.dataSources.forEach(source => content += `- ${source}\n`);
    
    content += `\n### Required Schema/Tables\n`;
    data.zohoImplementation.schema.forEach(table => {
      content += `\n**${table.table}:**\n`;
      content += `Fields: ${table.fields.join(', ')}\n`;
    });
    
    content += `\n### Key KPIs to Track\n`;
    data.zohoImplementation.kpis.forEach(kpi => content += `- ${kpi}\n`);
    
    content += `\n### Dashboard Components\n`;
    data.zohoImplementation.dashboards.forEach(dashboard => content += `- ${dashboard}\n`);
    
    content += `\n### Access & Permissions\n`;
    data.zohoImplementation.permissions.forEach(perm => content += `- ${perm}\n`);
    
    content += `\n### Architecture\n\n\`\`\`\n${data.zohoImplementation.architecture}\n\`\`\`\n`;
    
    content += `\n## CONSTRAINTS & CONSIDERATIONS\n\n`;
    data.constraints.forEach(constraint => content += `- ${constraint}\n`);
    
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MRD-${data.featureName.replace(/\s+/g, '-')}-v${data.version}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <FileText className="w-6 h-6 text-purple-600 mt-1" />
            <div>
              <h2 className="text-xl text-gray-900">{data.featureName}</h2>
              <p className="text-sm text-gray-600 mt-1">
                Market Requirements Document
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
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
        {/* Objectives */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-900">Objectives</h3>
            {!isLocked && (
              <button className="text-purple-600 hover:text-purple-700 text-sm flex items-center gap-1">
                <Edit2 className="w-3 h-3" />
                Edit
              </button>
            )}
          </div>
          <ul className="space-y-2">
            {data.objectives.map((obj, idx) => (
              <li key={idx} className="text-sm text-gray-700 flex gap-2">
                <span className="text-purple-500">•</span>
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Personas */}
        <section className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-900">User Personas</h3>
            {!isLocked && (
              <button className="text-purple-600 hover:text-purple-700 text-sm flex items-center gap-1">
                <Edit2 className="w-3 h-3" />
                Edit
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.personas.map((persona, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm text-gray-900 mb-1">{persona.name}</h4>
                <p className="text-xs text-gray-600 mb-2">
                  {persona.description}
                </p>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Key Needs:</p>
                  <ul className="space-y-1">
                    {persona.needs.map((need, i) => (
                      <li key={i} className="text-xs text-gray-700">
                        → {need}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Use Cases */}
        <section className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-900">Use Cases</h3>
            {!isLocked && (
              <button className="text-purple-600 hover:text-purple-700 text-sm flex items-center gap-1">
                <Edit2 className="w-3 h-3" />
                Edit
              </button>
            )}
          </div>
          <div className="space-y-3">
            {data.useCases.map((useCase, idx) => (
              <div key={idx} className="border-l-4 border-purple-300 pl-4">
                <h4 className="text-sm text-gray-900">{useCase.title}</h4>
                <p className="text-sm text-gray-600 mt-1">
                  {useCase.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Success Metrics */}
        <section className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-900">Success Metrics</h3>
            {!isLocked && (
              <button className="text-purple-600 hover:text-purple-700 text-sm flex items-center gap-1">
                <Edit2 className="w-3 h-3" />
                Edit
              </button>
            )}
          </div>
          <ul className="space-y-2">
            {data.successMetrics.map((metric, idx) => (
              <li key={idx} className="text-sm text-gray-700 flex gap-2">
                <span className="text-green-500">📊</span>
                <span>{metric}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Zoho Analytics Implementation */}
        <section className="border-t border-gray-200 pt-6 bg-blue-50 -mx-6 px-6 py-6">
          <h3 className="text-gray-900 mb-4">
            Zoho Analytics Implementation Guide
          </h3>

          <div className="space-y-4">
            {/* Data Sources */}
            <div>
              <h4 className="text-sm text-gray-700 mb-2">Data Sources</h4>
              <div className="flex flex-wrap gap-2">
                {data.zohoImplementation.dataSources.map((source, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-white border border-blue-200 rounded-full text-xs text-gray-700"
                  >
                    {source}
                  </span>
                ))}
              </div>
            </div>

            {/* Schema */}
            <div>
              <h4 className="text-sm text-gray-700 mb-2">
                Required Schema/Tables
              </h4>
              <div className="space-y-2">
                {data.zohoImplementation.schema.map((table, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-gray-200 rounded p-3"
                  >
                    <p className="text-xs text-gray-900 mb-1">
                      {table.table}
                    </p>
                    <p className="text-xs text-gray-600">
                      {table.fields.join(', ')}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* KPIs */}
            <div>
              <h4 className="text-sm text-gray-700 mb-2">Key KPIs to Track</h4>
              <ul className="space-y-1">
                {data.zohoImplementation.kpis.map((kpi, idx) => (
                  <li key={idx} className="text-sm text-gray-700">
                    • {kpi}
                  </li>
                ))}
              </ul>
            </div>

            {/* Dashboards */}
            <div>
              <h4 className="text-sm text-gray-700 mb-2">Dashboard Components</h4>
              <ul className="space-y-1">
                {data.zohoImplementation.dashboards.map((dashboard, idx) => (
                  <li key={idx} className="text-sm text-gray-700">
                    → {dashboard}
                  </li>
                ))}
              </ul>
            </div>

            {/* Architecture */}
            <div>
              <h4 className="text-sm text-gray-700 mb-2">
                Simple Architecture
              </h4>
              <div className="bg-white border border-gray-200 rounded p-4">
                <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                  {data.zohoImplementation.architecture}
                </pre>
              </div>
            </div>

            {/* Permissions */}
            <div>
              <h4 className="text-sm text-gray-700 mb-2">
                Access & Permissions
              </h4>
              <ul className="space-y-1">
                {data.zohoImplementation.permissions.map((perm, idx) => (
                  <li key={idx} className="text-sm text-gray-700">
                    🔒 {perm}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Constraints */}
        <section className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-900">Constraints & Considerations</h3>
            {!isLocked && (
              <button className="text-purple-600 hover:text-purple-700 text-sm flex items-center gap-1">
                <Edit2 className="w-3 h-3" />
                Edit
              </button>
            )}
          </div>
          <ul className="space-y-2">
            {data.constraints.map((constraint, idx) => (
              <li key={idx} className="text-sm text-gray-700 flex gap-2">
                <span className="text-orange-500">⚠</span>
                <span>{constraint}</span>
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
            Approve MRD
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
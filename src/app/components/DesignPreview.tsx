import React, { useState } from 'react';
import { Layout, Edit2, Check, Download } from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export interface DesignData {
  prompt: string;
  dashboards: Array<{
    name: string;
    widgets: Array<{
      type: 'chart' | 'table' | 'metric';
      title: string;
      data?: any;
    }>;
  }>;
}

interface DesignPreviewProps {
  data: DesignData;
  onUpdatePrompt: (prompt: string) => void;
  onRegenerate: () => void;
}

export function DesignPreview({
  data,
  onUpdatePrompt,
  onRegenerate,
}: DesignPreviewProps) {
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const [promptValue, setPromptValue] = useState(data.prompt);

  const sampleBarData = [
    { name: 'Week 1', value: 400 },
    { name: 'Week 2', value: 300 },
    { name: 'Week 3', value: 500 },
    { name: 'Week 4', value: 450 },
  ];

  const samplePieData = [
    { name: 'Active', value: 400 },
    { name: 'Pending', value: 300 },
    { name: 'Completed', value: 300 },
  ];

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'];

  const handleSavePrompt = () => {
    onUpdatePrompt(promptValue);
    setIsEditingPrompt(false);
  };

  const handleDownload = () => {
    let content = `# DASHBOARD DESIGN SPECIFICATIONS\n\n`;
    content += `**Generated:** ${new Date().toLocaleDateString()}\n\n`;
    content += `## DESIGN PROMPT\n\n`;
    content += `${data.prompt}\n\n`;
    content += `---\n\n`;
    
    content += `## DASHBOARD COMPONENTS\n\n`;
    data.dashboards.forEach(dashboard => {
      content += `### ${dashboard.name}\n\n`;
      content += `**Widgets:**\n`;
      dashboard.widgets.forEach(widget => {
        content += `- **${widget.title}** (${widget.type})\n`;
      });
      content += '\n';
    });
    
    content += `## IMPLEMENTATION NOTES\n\n`;
    content += `- Use Zoho Analytics standard color palette (purple, blue, green)\n`;
    content += `- All charts should be responsive and mobile-friendly\n`;
    content += `- Include real-time collaboration indicators\n`;
    content += `- Ensure accessibility compliance (WCAG 2.1 Level AA)\n`;
    content += `- Support dark mode toggle\n`;
    
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `design-specs-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Layout className="w-6 h-6 text-indigo-600 mt-1" />
            <div className="flex-1">
              <h2 className="text-xl text-gray-900">Design Preview</h2>
              <p className="text-sm text-gray-600 mt-1">
                Zoho Analytics Dashboard Design
              </p>
            </div>
          </div>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Specs
          </button>
        </div>
      </div>

      {/* Design Prompt */}
      <div className="p-6 bg-yellow-50 border-b border-yellow-200">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-sm text-gray-700">Design Prompt</h3>
          {!isEditingPrompt ? (
            <button
              onClick={() => setIsEditingPrompt(true)}
              className="text-purple-600 hover:text-purple-700 text-sm flex items-center gap-1"
            >
              <Edit2 className="w-3 h-3" />
              Edit
            </button>
          ) : (
            <button
              onClick={handleSavePrompt}
              className="text-green-600 hover:text-green-700 text-sm flex items-center gap-1"
            >
              <Check className="w-3 h-3" />
              Save
            </button>
          )}
        </div>

        {isEditingPrompt ? (
          <textarea
            value={promptValue}
            onChange={(e) => setPromptValue(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          />
        ) : (
          <p className="text-sm text-gray-700">{data.prompt}</p>
        )}

        <button
          onClick={onRegenerate}
          className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm transition-colors"
        >
          Regenerate Design
        </button>
      </div>

      {/* Dashboard Previews */}
      <div className="p-6 space-y-8">
        {data.dashboards.map((dashboard, idx) => (
          <div key={idx}>
            <h3 className="text-gray-900 mb-4">{dashboard.name}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dashboard.widgets.map((widget, widgetIdx) => (
                <div
                  key={widgetIdx}
                  className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                >
                  <h4 className="text-sm text-gray-900 mb-3">{widget.title}</h4>

                  {widget.type === 'chart' && (
                    <div className="h-48">
                      {widgetIdx % 3 === 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={sampleBarData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#8b5cf6" />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : widgetIdx % 3 === 1 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={sampleBarData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line
                              type="monotone"
                              dataKey="value"
                              stroke="#3b82f6"
                              strokeWidth={2}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={samplePieData}
                              cx="50%"
                              cy="50%"
                              outerRadius={60}
                              fill="#8884d8"
                              dataKey="value"
                              label
                            >
                              {samplePieData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  )}

                  {widget.type === 'table' && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-gray-300">
                            <th className="text-left py-2 text-gray-700">
                              Metric
                            </th>
                            <th className="text-right py-2 text-gray-700">
                              Value
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-gray-200">
                            <td className="py-2 text-gray-600">Total Users</td>
                            <td className="text-right text-gray-900">1,234</td>
                          </tr>
                          <tr className="border-b border-gray-200">
                            <td className="py-2 text-gray-600">Active Sessions</td>
                            <td className="text-right text-gray-900">567</td>
                          </tr>
                          <tr>
                            <td className="py-2 text-gray-600">Conversion Rate</td>
                            <td className="text-right text-gray-900">23.4%</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                  {widget.type === 'metric' && (
                    <div className="text-center py-4">
                      <div className="text-3xl text-gray-900 mb-1">2,456</div>
                      <div className="text-xs text-green-600">↑ 12.5% vs last week</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
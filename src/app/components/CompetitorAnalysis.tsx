import React from 'react';
import { TrendingUp, AlertCircle, Target, Play, Image, Download } from 'lucide-react';

export interface Competitor {
  name: string;
  strengths: string[];
  weaknesses: string[];
  marketPosition: string;
  screenshot?: string;
  videoUrl?: string;
}

export interface CompetitorAnalysisData {
  competitors: Competitor[];
  marketInsights: string[];
  opportunities: string[];
}

interface CompetitorAnalysisProps {
  data: CompetitorAnalysisData;
}

export function CompetitorAnalysis({ data }: CompetitorAnalysisProps) {
  const handleDownload = () => {
    // Create formatted content
    let content = '# COMPETITOR ANALYSIS REPORT\n\n';
    content += `Generated: ${new Date().toLocaleDateString()}\n\n`;
    content += '## KEY COMPETITORS\n\n';
    
    data.competitors.forEach((competitor) => {
      content += `### ${competitor.name}\n`;
      content += `**Market Position:** ${competitor.marketPosition}\n\n`;
      content += '**Strengths:**\n';
      competitor.strengths.forEach(s => content += `- ${s}\n`);
      content += '\n**Weaknesses:**\n';
      competitor.weaknesses.forEach(w => content += `- ${w}\n`);
      if (competitor.videoUrl) {
        content += `\n**Demo Video:** ${competitor.videoUrl}\n`;
      }
      content += '\n---\n\n';
    });
    
    content += '## MARKET INSIGHTS\n\n';
    data.marketInsights.forEach(insight => content += `- ${insight}\n`);
    
    content += '\n## OPPORTUNITIES FOR DIFFERENTIATION\n\n';
    data.opportunities.forEach(opp => content += `- ${opp}\n`);
    
    // Download
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `competitor-analysis-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg text-gray-900">Competitor Analysis</h3>
        </div>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download Report
        </button>
      </div>

      {/* Competitors */}
      <div className="space-y-4">
        <h4 className="text-sm text-gray-700">Key Competitors</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.competitors.map((competitor, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-lg p-4 space-y-3"
            >
              <div>
                <h5 className="text-gray-900">{competitor.name}</h5>
                <p className="text-xs text-gray-500 mt-1">
                  {competitor.marketPosition}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-600 mb-1">Strengths:</p>
                <ul className="space-y-1">
                  {competitor.strengths.map((strength, i) => (
                    <li key={i} className="text-xs text-gray-700 flex gap-1">
                      <span className="text-green-500">✓</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-xs text-gray-600 mb-1">Gaps/Weaknesses:</p>
                <ul className="space-y-1">
                  {competitor.weaknesses.map((weakness, i) => (
                    <li key={i} className="text-xs text-gray-700 flex gap-1">
                      <span className="text-orange-500">⚠</span>
                      <span>{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {competitor.screenshot && (
                <div className="mt-3 border-t border-gray-200 pt-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Image className="w-4 h-4 text-purple-600" />
                    <p className="text-xs text-gray-600">Product Screenshot</p>
                  </div>
                  <img
                    src={competitor.screenshot}
                    alt={`${competitor.name} screenshot`}
                    className="w-full h-48 object-cover rounded border border-gray-200"
                  />
                </div>
              )}

              {competitor.videoUrl && (
                <div className="mt-3 border-t border-gray-200 pt-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Play className="w-4 h-4 text-purple-600" />
                    <p className="text-xs text-gray-600">Product Demo</p>
                  </div>
                  <a
                    href={competitor.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 bg-purple-50 text-purple-700 rounded hover:bg-purple-100 transition-colors text-xs"
                  >
                    <Play className="w-3 h-3" />
                    Watch Demo Video
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Market Insights */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle className="w-4 h-4 text-blue-600" />
          <h4 className="text-sm text-gray-700">Market Insights</h4>
        </div>
        <ul className="space-y-2">
          {data.marketInsights.map((insight, idx) => (
            <li key={idx} className="text-sm text-gray-600 flex gap-2">
              <span className="text-blue-500">•</span>
              <span>{insight}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Opportunities */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-4 h-4 text-purple-600" />
          <h4 className="text-sm text-gray-700">Opportunities for Differentiation</h4>
        </div>
        <ul className="space-y-2">
          {data.opportunities.map((opportunity, idx) => (
            <li key={idx} className="text-sm text-gray-600 flex gap-2">
              <span className="text-purple-500">→</span>
              <span>{opportunity}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
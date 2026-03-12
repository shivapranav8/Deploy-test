import React, { useState } from 'react';
import { X, MessageSquare, Plus, Trash2, Link } from 'lucide-react';

interface CommunityTicketInputProps {
  onSubmit: (data: {
    ticketUrl?: string;
    issueDescription?: string;
    category?: string;
  }) => void;
  onClose: () => void;
}

export function CommunityTicketInput({ onSubmit, onClose }: CommunityTicketInputProps) {
  const [inputType, setInputType] = useState<'url' | 'manual'>('url');
  const [ticketUrl, setTicketUrl] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = () => {
    if (inputType === 'url') {
      if (!ticketUrl.trim()) return;
      onSubmit({ ticketUrl });
    } else {
      if (!issueDescription.trim() || !category.trim()) return;
      onSubmit({ issueDescription, category });
    }
  };

  const isValid = inputType === 'url' 
    ? ticketUrl.trim().length > 0
    : issueDescription.trim().length > 0 && category.trim().length > 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-red-600 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl text-gray-900">Generate Community Answer</h2>
            <p className="text-sm text-gray-500">
              Enter ticket URL or describe the issue
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Input Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Input Type
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setInputType('url')}
              className={`flex-1 p-4 border-2 rounded-lg transition-all ${
                inputType === 'url'
                  ? 'border-orange-600 bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <Link className={`w-5 h-5 ${inputType === 'url' ? 'text-orange-600' : 'text-gray-400'}`} />
                <div className="text-left">
                  <div className={`font-medium ${inputType === 'url' ? 'text-orange-600' : 'text-gray-700'}`}>
                    Zoho Desk Ticket URL
                  </div>
                  <div className="text-xs text-gray-500">Paste ticket link</div>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setInputType('manual')}
              className={`flex-1 p-4 border-2 rounded-lg transition-all ${
                inputType === 'manual'
                  ? 'border-orange-600 bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare className={`w-5 h-5 ${inputType === 'manual' ? 'text-orange-600' : 'text-gray-400'}`} />
                <div className="text-left">
                  <div className={`font-medium ${inputType === 'manual' ? 'text-orange-600' : 'text-gray-700'}`}>
                    Manual Entry
                  </div>
                  <div className="text-xs text-gray-500">Describe issue manually</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Ticket URL Input */}
        {inputType === 'url' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zoho Desk Ticket URL
            </label>
            <input
              type="url"
              value={ticketUrl}
              onChange={(e) => setTicketUrl(e.target.value)}
              placeholder="https://desk.zoho.com/support/acme/ShowHomePage.do#Cases/dv/..."
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-2">
              Paste the full URL of your Zoho Desk ticket
            </p>
          </div>
        )}

        {/* Manual Entry */}
        {inputType === 'manual' && (
          <>
            {/* Issue Description */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
                <MessageSquare className="w-4 h-4 text-orange-600" />
                Issue Description
              </label>
              <textarea
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                placeholder="Describe the issue you're facing in detail...&#10;&#10;Example:&#10;When I try to export data from the Analytics dashboard, the export button becomes unresponsive and no file is downloaded. This happens consistently across different browsers."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent min-h-[200px] resize-vertical"
              />
              <p className="text-xs text-gray-500 mt-1">
                Provide a clear and detailed description of the problem
              </p>
            </div>

            {/* Category */}
            <div>
              <label className="text-sm font-medium text-gray-900 mb-2 block">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Select a category</option>
                <option value="Bug Report">Bug Report</option>
                <option value="Feature Request">Feature Request</option>
                <option value="Technical Support">Technical Support</option>
                <option value="Account Issue">Account Issue</option>
                <option value="Performance Issue">Performance Issue</option>
                <option value="Integration Issue">Integration Issue</option>
                <option value="Documentation">Documentation</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
        <div className="text-sm text-gray-600">
          {isValid ? (
            <span className="text-green-600">✓ Ready to generate</span>
          ) : (
            <span>Fill in all required fields to continue</span>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
          >
            Generate Answer
          </button>
        </div>
      </div>
    </div>
  );
}
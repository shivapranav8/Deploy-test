import React, { useState } from 'react';
import { X, Link as LinkIcon, ExternalLink, CheckCircle } from 'lucide-react';

interface FigmaLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLink: (url: string) => void;
}

export function FigmaLinkModal({ isOpen, onClose, onLink }: FigmaLinkModalProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const validateFigmaUrl = (url: string): boolean => {
    // Check if it's a valid Figma Make published link
    return url.includes('figma.com') || url.includes('fig.ma');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Please enter a Figma design link');
      return;
    }

    if (!validateFigmaUrl(url)) {
      setError('Please enter a valid Figma link');
      return;
    }

    onLink(url);
    setUrl('');
    setError('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg text-gray-900">Add Figma Design Link</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Figma Make Design Published Link *
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError('');
              }}
              placeholder="https://www.figma.com/design/..."
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {error && (
              <p className="text-xs text-red-600 mt-1">{error}</p>
            )}
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="text-sm text-purple-900 mb-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              How to get your Figma Make design link:
            </h4>
            <ol className="text-xs text-purple-800 space-y-1 ml-6 list-decimal">
              <li>Open your design in Figma Make</li>
              <li>Click "Publish" or "Share" in the top right</li>
              <li>Enable "Publish to web" or "Get shareable link"</li>
              <li>Copy the published link and paste it here</li>
            </ol>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              💡 This link will be attached to your MRD for design reference and collaboration.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Attach Design Link
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
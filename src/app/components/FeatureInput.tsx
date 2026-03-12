import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface FeatureData {
  featureName: string;
  domain: string;
  problemStatement: string;
  targetUsers: string;
}

interface FeatureInputProps {
  onSubmit: (data: FeatureData) => void;
  onClose: () => void;
}

export function FeatureInput({ onSubmit, onClose }: FeatureInputProps) {
  const [formData, setFormData] = useState<FeatureData>({
    featureName: '',
    domain: '',
    problemStatement: '',
    targetUsers: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-purple-600" />
        <h2 className="text-xl text-gray-900">New Feature Request</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-700 mb-2">
            Feature Name *
          </label>
          <input
            type="text"
            name="featureName"
            value={formData.featureName}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="e.g., Real-time Collaboration Dashboard"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-2">
            Domain / Category *
          </label>
          <input
            type="text"
            name="domain"
            value={formData.domain}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="e.g., Analytics, CRM, Project Management"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-2">
            Problem Statement *
          </label>
          <textarea
            name="problemStatement"
            value={formData.problemStatement}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Describe the problem this feature will solve..."
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-2">
            Target Users *
          </label>
          <input
            type="text"
            name="targetUsers"
            value={formData.targetUsers}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="e.g., Product Managers, Data Analysts, Business Users"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md transition-colors"
          >
            Start Analysis
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
  );
}

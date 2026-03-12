import React from 'react';

type Status = 'pending' | 'approved' | 'changes-requested' | 'draft' | 'locked';

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const statusConfig = {
    pending: {
      label: 'Pending Review',
      className: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    },
    approved: {
      label: 'Approved',
      className: 'bg-green-100 text-green-800 border-green-300',
    },
    'changes-requested': {
      label: 'Changes Requested',
      className: 'bg-orange-100 text-orange-800 border-orange-300',
    },
    draft: {
      label: 'Draft',
      className: 'bg-gray-100 text-gray-800 border-gray-300',
    },
    locked: {
      label: 'Locked',
      className: 'bg-blue-100 text-blue-800 border-blue-300',
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-medium ${config.className} ${className}`}
    >
      {config.label}
    </span>
  );
}

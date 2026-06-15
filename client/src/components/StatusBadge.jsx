import React from 'react';

const STATUS_STYLES = {
  active: 'text-success',
  unverified: 'text-secondary',
  blocked: 'text-danger',
};

const STATUS_LABELS = {
  active: 'Active',
  unverified: 'Unverified',
  blocked: 'Blocked',
};

export default function StatusBadge({ status }) {
  const className = STATUS_STYLES[status] || 'text-muted';
  const label = STATUS_LABELS[status] || status;

  return <span className={className}>{label}</span>;
}

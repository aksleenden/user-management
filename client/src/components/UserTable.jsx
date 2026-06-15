import React from "react";

import StatusBadge from "./StatusBadge.jsx";

function formatRelativeTime(value) {
  if (!value) return "Never";

  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60) return "less than a minute ago";

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? "" : "s"} ago`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} hour${diffHour === 1 ? "" : "s"} ago`;

  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `${diffDay} day${diffDay === 1 ? "" : "s"} ago`;

  const diffWeek = Math.floor(diffDay / 7);
  if (diffWeek < 5) return `${diffWeek} week${diffWeek === 1 ? "" : "s"} ago`;

  const diffMonth = Math.floor(diffDay / 30);
  if (diffMonth < 12)
    return `${diffMonth} month${diffMonth === 1 ? "" : "s"} ago`;

  const diffYear = Math.floor(diffDay / 365);
  return `${diffYear} year${diffYear === 1 ? "" : "s"} ago`;
}

function SortableHeader({ label, field, sortBy, order, onSort, className }) {
  const isActive = sortBy === field;
  const icon = isActive
    ? order === "asc"
      ? "bi-arrow-up"
      : "bi-arrow-down"
    : "bi-arrow-down text-opacity-25";

  return (
    <th
      role="button"
      className={`user-select-none ${className || ""}`}
      onClick={() => onSort(field)}
      title={`Sort by ${label}`}
    >
      {label} <i className={`bi ${icon} small text-muted`} aria-hidden="true" />
    </th>
  );
}

export default function UserTable({
  users,
  selectedIds,
  onToggleOne,
  onToggleAll,
  sortBy,
  order,
  onSort,
  currentUserId,
}) {
  const allSelected =
    users.length > 0 && users.every((u) => selectedIds.has(u._id));
  const someSelected = users.some((u) => selectedIds.has(u._id));

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle bg-white users-table">
        <thead>
          <tr>
            <th style={{ width: "2.5rem" }}>
              <input
                type="checkbox"
                className="form-check-input"
                checked={allSelected}
                ref={(el) => {
                  if (el) el.indeterminate = !allSelected && someSelected;
                }}
                onChange={(e) => onToggleAll(e.target.checked)}
                aria-label="Select all users"
                title="Select all / deselect all"
              />
            </th>
            <SortableHeader
              label="Name"
              field="name"
              sortBy={sortBy}
              order={order}
              onSort={onSort}
            />
            <SortableHeader
              label="Email"
              field="email"
              sortBy={sortBy}
              order={order}
              onSort={onSort}
            />
            <SortableHeader
              label="Status"
              field="status"
              sortBy={sortBy}
              order={order}
              onSort={onSort}
              className="text-center"
            />
            <SortableHeader
              label="Last seen"
              field="lastLoginTime"
              sortBy={sortBy}
              order={order}
              onSort={onSort}
              className="text-end"
            />
          </tr>
        </thead>
        <tbody>
          {users.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center text-muted py-4">
                No users found.
              </td>
            </tr>
          )}
          {users.map((u) => (
            <tr
              key={u._id}
              className={selectedIds.has(u._id) ? "table-active" : ""}
            >
              <td>
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedIds.has(u._id)}
                  onChange={(e) => onToggleOne(u._id, e.target.checked)}
                  aria-label={`Select ${u.name}`}
                />
              </td>
              <td className="text-start">
                {u.name}
                {String(u._id) === String(currentUserId) && (
                  <span className="badge text-bg-light text-muted ms-2">
                    you
                  </span>
                )}
              </td>
              <td className="text-start text-break">{u.email}</td>
              <td className="text-center">
                <StatusBadge status={u.status} />
              </td>
              <td
                className="text-end"
                title={
                  u.lastLoginTime
                    ? new Date(u.lastLoginTime).toLocaleString()
                    : "Never logged in"
                }
              >
                {formatRelativeTime(u.lastLoginTime)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

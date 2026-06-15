import React from "react";

export default function Toolbar({
  selectedCount,
  hasBlockedSelected,
  search,
  onSearchChange,
  onBlock,
  onUnblock,
  onDelete,
  onDeleteUnverified,
}) {
  const noSelection = selectedCount === 0;

  return (
    <div className="d-flex flex-wrap align-items-center gap-2 mb-2 toolbar">
      <button
        type="button"
        className="btn btn-outline-primary"
        disabled={noSelection}
        onClick={onBlock}
        title="Block selected users"
      >
        <i className="bi bi-lock-fill me-1" aria-hidden="true" />
        Block
      </button>

      <button
        type="button"
        className="btn btn-outline-secondary"
        disabled={noSelection || !hasBlockedSelected}
        onClick={onUnblock}
        title="Unblock selected users"
        aria-label="Unblock selected users"
      >
        <i className="bi bi-unlock-fill" aria-hidden="true" />
      </button>

      <button
        type="button"
        className="btn btn-outline-danger"
        disabled={noSelection}
        onClick={onDelete}
        title="Delete selected users"
        aria-label="Delete selected users"
      >
        <i className="bi bi-trash-fill" aria-hidden="true" />
      </button>

      <button
        type="button"
        className="btn btn-outline-danger"
        disabled={noSelection}
        onClick={onDeleteUnverified}
        title="Delete selected users that are unverified"
        aria-label="Delete selected unverified users"
      >
        <i className="bi bi-person-x-fill" aria-hidden="true" />
      </button>

      <div className="ms-auto" style={{ minWidth: "220px" }}>
        <input
          type="search"
          className="form-control form-control-sm"
          placeholder="Filter"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Filter users by name or e-mail"
        />
      </div>
    </div>
  );
}

import React, { useEffect } from "react";

export default function Toast({ message, variant = "success", onClose }) {
  useEffect(() => {
    if (!message) return undefined;
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const bgClass = variant === "error" ? "text-bg-danger" : "text-bg-success";

  return (
    <div
      className="toast-container position-fixed bottom-0 end-0 p-3"
      style={{ zIndex: 1080 }}
    >
      <div className={`toast show ${bgClass}`} role="status" aria-live="polite">
        <div className="d-flex">
          <div className="toast-body">{message}</div>
          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            aria-label="Close"
            onClick={onClose}
          />
        </div>
      </div>
    </div>
  );
}

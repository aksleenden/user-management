import React from "react";

import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark mb-4">
      <div className="container-fluid">
        <span className="navbar-brand mb-0 h1">User Management</span>
        {user && (
          <div className="d-flex align-items-center text-white-50 gap-3">
            <span className="d-none d-sm-inline">
              Signed in as <strong className="text-white">{user.name}</strong>
            </span>
            <button
              type="button"
              className="btn btn-outline-light btn-sm"
              onClick={logout}
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

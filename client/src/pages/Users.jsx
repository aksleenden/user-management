import React, { useCallback, useEffect, useState } from "react";

import api from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import Toolbar from "../components/Toolbar.jsx";
import UserTable from "../components/UserTable.jsx";
import Toast from "../components/Toast.jsx";

export default function Users() {
  const { user: currentUser, logout } = useAuth();

  const [users, setUsers] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("lastLoginTime");
  const [order, setOrder] = useState("desc");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null); 

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/users", {
        params: { search, sortBy, order },
      });
      setUsers(data.users);
      setSelectedIds((prev) => {
        const next = new Set();
        data.users.forEach((u) => {
          if (prev.has(u._id)) next.add(u._id);
        });
        return next;
      });
    } catch (_err) {
      setToast({ message: "Failed to load users", variant: "error" });
    } finally {
      setLoading(false);
    }
  }, [search, sortBy, order]);

  useEffect(() => {
    const timer = setTimeout(fetchUsers, 300);
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  function handleSort(field) {
    if (field === sortBy) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setOrder("asc");
    }
  }

  function toggleOne(id, checked) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function toggleAll(checked) {
    setSelectedIds(() => {
      if (!checked) return new Set();
      return new Set(users.map((u) => u._id));
    });
  }

  async function runAction(endpoint, confirmMessage) {
    if (selectedIds.size === 0) return;
    if (confirmMessage && !window.confirm(confirmMessage)) return;

    try {
      const ids = Array.from(selectedIds);
      const { data } = await api.post(`/users/${endpoint}`, { ids });

      setToast({ message: data.message, variant: "success" });

      if (data.selfAffected) {
        await logout();
        return;
      }

      setSelectedIds(new Set());
      await fetchUsers();
    } catch (err) {
      const msg =
        err.response && err.response.data
          ? err.response.data.error
          : "Action failed";
      setToast({ message: msg, variant: "error" });
    }
  }

  const hasBlockedSelected = users.some(
    (u) => selectedIds.has(u._id) && u.status === "blocked",
  );

  return (
    <div className="container">
      <h1 className="h4 mb-3">User management</h1>

      <Toolbar
        selectedCount={selectedIds.size}
        hasBlockedSelected={hasBlockedSelected}
        search={search}
        onSearchChange={setSearch}
        onBlock={() => runAction("block", "Block the selected user(s)?")}
        onUnblock={() => runAction("unblock")}
        onDelete={() =>
          runAction(
            "delete",
            "Permanently delete the selected user(s)? This cannot be undone.",
          )
        }
        onDeleteUnverified={() => runAction("delete-unverified")}
      />

      {loading ? (
        <div className="text-center text-muted py-5">Loading…</div>
      ) : (
        <UserTable
          users={users}
          selectedIds={selectedIds}
          onToggleOne={toggleOne}
          onToggleAll={toggleAll}
          sortBy={sortBy}
          order={order}
          onSort={handleSort}
          currentUserId={currentUser ? currentUser._id : null}
        />
      )}

      <Toast
        message={toast ? toast.message : ""}
        variant={toast ? toast.variant : "success"}
        onClose={() => setToast(null)}
      />
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import api from "../api.js";

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    api
      .get(`/auth/verify/${token}`)
      .then((res) => {
        if (!isMounted) return;
        setStatus("success");
        setMessage(res.data.message);
      })
      .catch((err) => {
        if (!isMounted) return;
        setStatus("error");
        setMessage(
          err.response && err.response.data
            ? err.response.data.error
            : "Verification failed",
        );
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-8 col-md-6 col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body p-4 text-center">
              {status === "loading" && (
                <p className="mb-0">Verifying your e-mail…</p>
              )}

              {status === "success" && (
                <>
                  <h1 className="h4 mb-3">E-mail verified</h1>
                  <p className="text-muted">{message}</p>
                  <Link to="/login" className="btn btn-primary mt-2">
                    Go to sign in
                  </Link>
                </>
              )}

              {status === "error" && (
                <>
                  <h1 className="h4 mb-3">Verification failed</h1>
                  <p className="text-muted">{message}</p>
                  <Link to="/login" className="btn btn-outline-secondary mt-2">
                    Back to sign in
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

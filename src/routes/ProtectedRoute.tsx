import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("accessAdmin")
  );
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const checkToken = () => {
      setToken(localStorage.getItem("accessAdmin"));
      setChecked(true);
    };

    checkToken();

    window.addEventListener("storage", checkToken);

    return () => {
      window.removeEventListener("storage", checkToken);
    };
  }, []);

  if (!checked) return null;

  return token ? <Outlet /> : <Navigate to="/signIn" replace />;
};

export default ProtectedRoute;

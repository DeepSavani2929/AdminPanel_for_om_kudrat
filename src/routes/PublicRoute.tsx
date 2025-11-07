import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("accessAdmin"));
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

  return token ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;

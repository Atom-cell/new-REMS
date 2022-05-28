import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import LandPage from "./components/LandPage";

const useAuth = () => {
  const token = localStorage.getItem("token");
  if (token) return true;
  else return false;
};
function ProtectedRoutes() {
  const isAuth = useAuth();
  return isAuth ? <Outlet /> : <LandPage />;
}

export default ProtectedRoutes;
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { authManager } from "@/lib/auth";
import LoginForm from "@/components/admin/login-form";
import AdminDashboard from "@/components/admin/admin-dashboard";
import { motion } from "framer-motion";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(authManager.isAuthenticated());

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authManager.clearAuth();
    setIsAuthenticated(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-slate-50 dark:bg-slate-900"
    >
      {isAuthenticated ? (
        <AdminDashboard onLogout={handleLogout} />
      ) : (
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      )}
    </motion.div>
  );
}

import { useState, useEffect } from "react";
import { authManager } from "@/lib/auth";
import LoginForm from "@/components/admin/login-form";
import AdminDashboard from "@/components/admin/admin-dashboard";
import { motion } from "framer-motion";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(authManager.isAuthenticated());
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Cek token ke server setiap kali halaman admin dibuka
    const checkAuthServer = async () => {
      if (!authManager.isAuthenticated()) {
        setIsAuthenticated(false);
        setChecking(false);
        return;
      }
      try {
        const res = await fetch("/api/profile", {
          headers: authManager.getAuthHeaders(),
        });
        if (res.status === 401) {
          authManager.clearAuth();
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      } catch {
        setIsAuthenticated(false);
      }
      setChecking(false);
    };
    checkAuthServer();
    // Tambahkan event listener untuk memastikan pengecekan ulang saat tab diaktifkan
    const onFocus = () => checkAuthServer();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authManager.clearAuth();
    setIsAuthenticated(false);
  };

  if (checking) {
    return <div className="min-h-screen flex items-center justify-center">Checking authentication...</div>;
  }

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

import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  React.useEffect(() => {
    console.log('[Guard] ProtectedRoute State:', { 
      path: location.pathname, 
      loading, 
      authenticated: !!user, 
      isAdmin,
      userEmail: user?.email 
    });
  }, [location.pathname, loading, user, isAdmin]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-950">
        <div className="w-12 h-12 border-4 border-lilac border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-lilac">Verificando Credenciais...</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

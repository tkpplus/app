import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

type ToastType = 'success' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
  puppet: string;
}

interface ToastContextType {
  addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const puppets = ['Yosef', 'Benny', 'Aharón', 'Ezra', 'Arush', 'Keter', 'Avraham'];

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now();
    const puppet = puppets[Math.floor(Math.random() * puppets.length)];
    setToasts((prev) => [...prev, { id, message, type, puppet }]);

    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="animate-[toast-slide_0.3s_ease-out_forwards] bg-surface/95 border border-white/10 shadow-2xl rounded-xl p-4 flex items-center gap-4 backdrop-blur-md max-w-sm pointer-events-auto"
            style={{
              animation: 'toast-slide 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-xl font-bold bg-gradient-to-br from-primary to-accent-orange text-black">
              {toast.puppet.charAt(0)}
            </div>
            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-wider mb-0.5">{toast.puppet} dice:</p>
              <p className="text-sm font-medium text-white/90">{toast.message}</p>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

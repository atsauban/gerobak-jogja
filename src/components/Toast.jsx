import React, { useState, useEffect, createContext, useContext } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X, RotateCcw, RefreshCw } from 'lucide-react';

// Toast Context
const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Toast Provider
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const MAX_TOASTS = 3; // Maximum number of toasts to show

  const addToast = (message, type = 'info', duration = 4000, action = null) => {
    const id = Date.now() + Math.random();
    const toast = { id, message, type, duration, action };

    setToasts(prev => {
      // Keep only last MAX_TOASTS toasts
      const newToasts = [...prev, toast];
      return newToasts.slice(-MAX_TOASTS);
    });

    // Auto remove toast if duration > 0
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const toast = {
    success: (message, duration, action) => addToast(message, 'success', duration, action),
    error: (message, duration, action) => addToast(message, 'error', duration, action),
    warning: (message, duration, action) => addToast(message, 'warning', duration, action),
    info: (message, duration, action) => addToast(message, 'info', duration, action),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

// Toast Container with responsive positioning
const ToastContainer = ({ toasts, removeToast }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (toasts.length === 0) return null;

  // Position: bottom on mobile, top-right on desktop
  const containerClass = isMobile
    ? 'fixed bottom-4 left-4 right-4 z-[9999] space-y-2'
    : 'fixed top-20 right-4 z-[9999] space-y-2 max-w-sm';

  return (
    <div className={containerClass}>
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
};

// Individual Toast Item
const ToastItem = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = React.useRef(null);

  useEffect(() => {
    // Trigger animation
    setTimeout(() => setIsVisible(true), 10);

    // Auto remove if duration > 0 and not paused
    if (toast.duration > 0 && !isPaused) {
      timeoutRef.current = setTimeout(() => {
        handleRemove();
      }, toast.duration);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [toast.duration, isPaused]);

  const handleRemove = () => {
    setIsVisible(false);
    setTimeout(() => onRemove(toast.id), 300);
  };

  const handlePause = () => {
    setIsPaused(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleResume = () => {
    setIsPaused(false);
    if (toast.duration > 0) {
      timeoutRef.current = setTimeout(() => {
        handleRemove();
      }, toast.duration);
    }
  };

  const getToastStyles = () => {
    const baseStyles = "flex items-start gap-3 p-4 rounded-lg shadow-lg border transition-all duration-300 transform w-full";

    if (!isVisible) {
      return `${baseStyles} translate-x-full opacity-0`;
    }

    switch (toast.type) {
      case 'success':
        return `${baseStyles} bg-green-50 border-green-200 text-green-800`;
      case 'error':
        return `${baseStyles} bg-red-50 border-red-200 text-red-800`;
      case 'warning':
        return `${baseStyles} bg-yellow-50 border-yellow-200 text-yellow-800`;
      default:
        return `${baseStyles} bg-blue-50 border-blue-200 text-blue-800`;
    }
  };

  const getIcon = () => {
    const iconProps = { size: 20, className: 'flex-shrink-0 mt-0.5' };

    switch (toast.type) {
      case 'success':
        return <CheckCircle {...iconProps} className={`${iconProps.className} text-green-600`} />;
      case 'error':
        return <XCircle {...iconProps} className={`${iconProps.className} text-red-600`} />;
      case 'warning':
        return <AlertCircle {...iconProps} className={`${iconProps.className} text-yellow-600`} />;
      default:
        return <Info {...iconProps} className={`${iconProps.className} text-blue-600`} />;
    }
  };

  return (
    <div
      className={getToastStyles()}
      onMouseEnter={handlePause}
      onMouseLeave={handleResume}
      role="alert"
      aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
    >
      {getIcon()}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium break-words">{toast.message}</p>
        {toast.action && (
          <div className="mt-2 flex gap-2">
            {toast.action.onUndo && (
              <button
                onClick={() => {
                  toast.action.onUndo();
                  handleRemove();
                }}
                className="text-xs font-semibold px-3 py-1.5 rounded-md bg-white/50 hover:bg-white/80 transition-colors flex items-center gap-1.5"
              >
                <RotateCcw size={12} />
                Undo
              </button>
            )}
            {toast.action.onRetry && (
              <button
                onClick={() => {
                  toast.action.onRetry();
                  handleRemove();
                }}
                className="text-xs font-semibold px-3 py-1.5 rounded-md bg-white/50 hover:bg-white/80 transition-colors flex items-center gap-1.5"
              >
                <RefreshCw size={12} />
                Retry
              </button>
            )}
            {toast.action.onAction && (
              <button
                onClick={() => {
                  toast.action.onAction();
                  handleRemove();
                }}
                className="text-xs font-semibold px-3 py-1.5 rounded-md bg-white/50 hover:bg-white/80 transition-colors"
              >
                {toast.action.label || 'Action'}
              </button>
            )}
          </div>
        )}
      </div>
      <button
        onClick={handleRemove}
        className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 p-1 rounded hover:bg-white/50"
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default ToastProvider;

/**
 * Toast Component
 * Notification toast messages
 */

import React, { useEffect, useState } from 'react';
import { FiCheck, FiX, FiAlertCircle, FiInfo } from 'react-icons/fi';
import './Toast.css';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
  position?: 'top' | 'bottom' | 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  showCloseButton?: boolean;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onClose,
  position = 'top',
  showCloseButton = true,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 200);
  };

  if (!isVisible) return null;

  const icons = {
    success: <FiCheck size={20} />,
    error: <FiX size={20} />,
    warning: <FiAlertCircle size={20} />,
    info: <FiInfo size={20} />,
  };

  const toastClasses = [
    'toast',
    `toast--${type}`,
    `toast--${position}`,
    isLeaving ? 'toast--leaving' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={toastClasses}>
      <span className="toast-icon">{icons[type]}</span>
      <span className="toast-message">{message}</span>
      {showCloseButton && (
        <button className="toast-close" onClick={handleClose} aria-label="Close">
          <FiX size={18} />
        </button>
      )}
    </div>
  );
};

// Toast Container for multiple toasts
interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onRemove: (id: string) => void;
  position?: ToastProps['position'];
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onRemove,
  position = 'top-right',
}) => {
  return (
    <div className={`toast-container toast-container--${position}`}>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => onRemove(toast.id)}
          position={position}
        />
      ))}
    </div>
  );
};

export default Toast;

import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { WebSocketMessage, WebSocketEventType } from '../api/types/websocketTypes';

interface Notification {
  id: string;
  type: WebSocketEventType;
  message: string;
  timestamp: Date;
  isRead: boolean;
}

interface WebSocketNotificationsProps {
  maxNotifications?: number;
  autoHide?: boolean;
  hideDelay?: number;
  className?: string;
}

export const WebSocketNotifications: React.FC<WebSocketNotificationsProps> = ({
  maxNotifications = 5,
  autoHide = true,
  hideDelay = 5000,
  className = ''
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const { 
    onPromotionCreated, 
    onPromotionUpdated, 
    onPromotionDeleted, 
    onPromotionStatusChanged,
    onConnect,
    onDisconnect,
    onError
  } = useWebSocket();

  const addNotification = (type: WebSocketEventType, message: string) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date(),
      isRead: false
    };

    setNotifications(prev => {
      const updated = [newNotification, ...prev];
      return updated.slice(0, maxNotifications);
    });

    setShowNotifications(true);

    if (autoHide) {
      setTimeout(() => {
        setNotifications(prev => 
          prev.filter(notification => notification.id !== newNotification.id)
        );
      }, hideDelay);
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Set up WebSocket event listeners
  useEffect(() => {
    onPromotionCreated((data) => {
      addNotification(
        WebSocketEventType.PROMOTION_CREATED,
        `New promotion created: ${data.data.promotion.promotionName}`
      );
    });

    onPromotionUpdated((data) => {
      addNotification(
        WebSocketEventType.PROMOTION_UPDATED,
        `Promotion updated: ${data.data.promotion.promotionName}`
      );
    });

    onPromotionDeleted((data) => {
      addNotification(
        WebSocketEventType.PROMOTION_DELETED,
        `Promotion deleted: ${data.data.promotionId}`
      );
    });

    onPromotionStatusChanged((data) => {
      addNotification(
        WebSocketEventType.PROMOTION_STATUS_CHANGED,
        `Promotion status changed: ${data.data.promotionId} (${data.data.previousStatus} → ${data.data.newStatus})`
      );
    });

    onConnect(() => {
      addNotification(
        WebSocketEventType.CONNECT,
        'WebSocket connected successfully'
      );
    });

    onDisconnect((data) => {
      addNotification(
        WebSocketEventType.DISCONNECT,
        `WebSocket disconnected: ${data.data.reason || 'Unknown reason'}`
      );
    });

    onError((data) => {
      addNotification(
        WebSocketEventType.ERROR,
        `WebSocket error: ${data.data.message}`
      );
    });
  }, [onPromotionCreated, onPromotionUpdated, onPromotionDeleted, onPromotionStatusChanged, onConnect, onDisconnect, onError]);

  const getNotificationIcon = (type: WebSocketEventType) => {
    switch (type) {
      case WebSocketEventType.PROMOTION_CREATED:
        return '➕';
      case WebSocketEventType.PROMOTION_UPDATED:
        return '✏️';
      case WebSocketEventType.PROMOTION_DELETED:
        return '🗑️';
      case WebSocketEventType.PROMOTION_STATUS_CHANGED:
        return '🔄';
      case WebSocketEventType.CONNECT:
        return '🟢';
      case WebSocketEventType.DISCONNECT:
        return '🔴';
      case WebSocketEventType.ERROR:
        return '⚠️';
      default:
        return '📢';
    }
  };

  const getNotificationColor = (type: WebSocketEventType) => {
    switch (type) {
      case WebSocketEventType.PROMOTION_CREATED:
        return 'border-green-200 bg-green-50';
      case WebSocketEventType.PROMOTION_UPDATED:
        return 'border-blue-200 bg-blue-50';
      case WebSocketEventType.PROMOTION_DELETED:
        return 'border-red-200 bg-red-50';
      case WebSocketEventType.PROMOTION_STATUS_CHANGED:
        return 'border-yellow-200 bg-yellow-50';
      case WebSocketEventType.CONNECT:
        return 'border-green-200 bg-green-50';
      case WebSocketEventType.DISCONNECT:
        return 'border-red-200 bg-red-50';
      case WebSocketEventType.ERROR:
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-gray-700">
          Notifications ({notifications.length})
        </h3>
        <button
          onClick={clearAllNotifications}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          Clear all
        </button>
      </div>
      
      <div className="space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-3 rounded-lg border transition-all duration-200 ${
              getNotificationColor(notification.type)
            } ${notification.isRead ? 'opacity-75' : ''}`}
            onMouseEnter={() => markAsRead(notification.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2 flex-1">
                <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {notification.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="text-gray-400 hover:text-gray-600 text-sm ml-2"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 
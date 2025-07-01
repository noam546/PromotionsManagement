import React from 'react';
import { useWebSocket } from '../hooks/useWebSocket';

interface WebSocketStatusProps {
  showControls?: boolean;
  className?: string;
}

export const WebSocketStatus: React.FC<WebSocketStatusProps> = ({ 
  showControls = true, 
  className = '' 
}) => {
  const { 
    isConnected, 
    isConnecting, 
    connectionStatus, 
    connect, 
    disconnect 
  } = useWebSocket({ autoConnect: false });

  const getStatusColor = () => {
    if (isConnecting) return 'text-yellow-600';
    if (isConnected) return 'text-green-600';
    return 'text-red-600';
  };

  const getStatusText = () => {
    if (isConnecting) return 'Connecting...';
    if (isConnected) return 'Connected';
    return 'Disconnected';
  };

  const getStatusIcon = () => {
    if (isConnecting) return '🔄';
    if (isConnected) return '🟢';
    return '🔴';
  };

  return (
    <div className={`flex items-center gap-2 p-2 rounded-lg bg-gray-50 border ${className}`}>
      <span className="text-lg">{getStatusIcon()}</span>
      <div className="flex flex-col">
        <span className={`text-sm font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </span>
        {isConnected && connectionStatus.lastConnected && (
          <span className="text-xs text-gray-500">
            Connected: {new Date(connectionStatus.lastConnected).toLocaleTimeString()}
          </span>
        )}
        {!isConnected && connectionStatus.lastDisconnected && (
          <span className="text-xs text-gray-500">
            Disconnected: {new Date(connectionStatus.lastDisconnected).toLocaleTimeString()}
          </span>
        )}
        {connectionStatus.reconnectAttempts > 0 && (
          <span className="text-xs text-orange-600">
            Reconnect attempts: {connectionStatus.reconnectAttempts}
          </span>
        )}
      </div>
      
      {showControls && (
        <div className="ml-auto flex gap-2">
          {!isConnected && !isConnecting && (
            <button
              onClick={connect}
              className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Connect
            </button>
          )}
          {isConnected && (
            <button
              onClick={disconnect}
              className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Disconnect
            </button>
          )}
          {isConnecting && (
            <button
              disabled
              className="px-3 py-1 text-xs bg-gray-400 text-white rounded cursor-not-allowed"
            >
              Connecting...
            </button>
          )}
        </div>
      )}
    </div>
  );
}; 
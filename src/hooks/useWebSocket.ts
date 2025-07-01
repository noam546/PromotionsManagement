import { useEffect, useState, useCallback, useRef } from 'react';
import { webSocketService } from '../api/websocket';
import { 
  WebSocketEventType, 
  WebSocketMessage, 
  WebSocketConnectionStatus,
  PromotionCreatedMessage,
  PromotionUpdatedMessage,
  PromotionDeletedMessage,
  PromotionStatusChangedMessage
} from '../api/types/websocketTypes';

interface UseWebSocketOptions {
  autoConnect?: boolean;
  autoJoinPromotionsRoom?: boolean;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  isConnecting: boolean;
  connectionStatus: WebSocketConnectionStatus;
  connect: () => Promise<void>;
  disconnect: () => void;
  joinPromotionsRoom: () => void;
  leavePromotionsRoom: () => void;
  onPromotionCreated: (callback: (data: WebSocketMessage<PromotionCreatedMessage>) => void) => void;
  onPromotionUpdated: (callback: (data: WebSocketMessage<PromotionUpdatedMessage>) => void) => void;
  onPromotionDeleted: (callback: (data: WebSocketMessage<PromotionDeletedMessage>) => void) => void;
  onPromotionStatusChanged: (callback: (data: WebSocketMessage<PromotionStatusChangedMessage>) => void) => void;
  onConnect: (callback: (data: WebSocketMessage) => void) => void;
  onDisconnect: (callback: (data: WebSocketMessage) => void) => void;
  onError: (callback: (data: WebSocketMessage) => void) => void;
}

export const useWebSocket = (options: UseWebSocketOptions = {}): UseWebSocketReturn => {
  const { autoConnect = true, autoJoinPromotionsRoom = true } = options;
  
  const [connectionStatus, setConnectionStatus] = useState<WebSocketConnectionStatus>(
    webSocketService.getConnectionStatus()
  );
  
  const callbacksRef = useRef<Map<WebSocketEventType, Set<Function>>>(new Map());

  const updateConnectionStatus = useCallback(() => {
    setConnectionStatus(webSocketService.getConnectionStatus());
  }, []);

  const connect = useCallback(async () => {
    try {
      await webSocketService.connect();
      updateConnectionStatus();
      
      if (autoJoinPromotionsRoom) {
        webSocketService.joinPromotionsRoom();
      }
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      throw error;
    }
  }, [autoJoinPromotionsRoom, updateConnectionStatus]);

  const disconnect = useCallback(() => {
    webSocketService.disconnect();
    updateConnectionStatus();
  }, [updateConnectionStatus]);

  const joinPromotionsRoom = useCallback(() => {
    webSocketService.joinPromotionsRoom();
  }, []);

  const leavePromotionsRoom = useCallback(() => {
    webSocketService.leavePromotionsRoom();
  }, []);

  const addEventListener = useCallback((eventType: WebSocketEventType, callback: Function) => {
    if (!callbacksRef.current.has(eventType)) {
      callbacksRef.current.set(eventType, new Set());
    }
    callbacksRef.current.get(eventType)!.add(callback);
    
    webSocketService.on(eventType, callback);
  }, []);

  const onPromotionCreated = useCallback((callback: (data: WebSocketMessage<PromotionCreatedMessage>) => void) => {
    addEventListener(WebSocketEventType.PROMOTION_CREATED, callback);
  }, [addEventListener]);

  const onPromotionUpdated = useCallback((callback: (data: WebSocketMessage<PromotionUpdatedMessage>) => void) => {
    addEventListener(WebSocketEventType.PROMOTION_UPDATED, callback);
  }, [addEventListener]);

  const onPromotionDeleted = useCallback((callback: (data: WebSocketMessage<PromotionDeletedMessage>) => void) => {
    addEventListener(WebSocketEventType.PROMOTION_DELETED, callback);
  }, [addEventListener]);

  const onPromotionStatusChanged = useCallback((callback: (data: WebSocketMessage<PromotionStatusChangedMessage>) => void) => {
    addEventListener(WebSocketEventType.PROMOTION_STATUS_CHANGED, callback);
  }, [addEventListener]);

  const onConnect = useCallback((callback: (data: WebSocketMessage) => void) => {
    addEventListener(WebSocketEventType.CONNECT, callback);
  }, [addEventListener]);

  const onDisconnect = useCallback((callback: (data: WebSocketMessage) => void) => {
    addEventListener(WebSocketEventType.DISCONNECT, callback);
  }, [addEventListener]);

  const onError = useCallback((callback: (data: WebSocketMessage) => void) => {
    addEventListener(WebSocketEventType.ERROR, callback);
  }, [addEventListener]);

  // Set up connection status listeners
  useEffect(() => {
    const handleConnect = () => updateConnectionStatus();
    const handleDisconnect = () => updateConnectionStatus();
    const handleError = () => updateConnectionStatus();

    webSocketService.on(WebSocketEventType.CONNECT, handleConnect);
    webSocketService.on(WebSocketEventType.DISCONNECT, handleDisconnect);
    webSocketService.on(WebSocketEventType.ERROR, handleError);

    return () => {
      webSocketService.off(WebSocketEventType.CONNECT, handleConnect);
      webSocketService.off(WebSocketEventType.DISCONNECT, handleDisconnect);
      webSocketService.off(WebSocketEventType.ERROR, handleError);
    };
  }, [updateConnectionStatus]);

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect && !webSocketService.isConnected()) {
      connect();
    }

    return () => {
      // Clean up event listeners on unmount
      callbacksRef.current.forEach((callbacks, eventType) => {
        callbacks.forEach(callback => {
          webSocketService.off(eventType, callback);
        });
      });
      callbacksRef.current.clear();
    };
  }, [autoConnect, connect]);

  return {
    isConnected: connectionStatus.isConnected,
    isConnecting: connectionStatus.isConnecting,
    connectionStatus,
    connect,
    disconnect,
    joinPromotionsRoom,
    leavePromotionsRoom,
    onPromotionCreated,
    onPromotionUpdated,
    onPromotionDeleted,
    onPromotionStatusChanged,
    onConnect,
    onDisconnect,
    onError,
  };
}; 
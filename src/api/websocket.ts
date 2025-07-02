import { io, Socket } from 'socket.io-client';
import { 
  WebSocketEventType, 
  WebSocketMessage, 
  WebSocketConnectionStatus,
  PromotionCreatedMessage,
  PromotionUpdatedMessage,
  PromotionDeletedMessage,
} from './types';

export class WebSocketService {
  private socket: Socket | null = null;
  private connectionStatus: WebSocketConnectionStatus = {
    isConnected: false,
    isConnecting: false,
    reconnectAttempts: 0
  };
  private eventListeners: Map<WebSocketEventType, Set<Function>> = new Map();
  private reconnectInterval: NodeJS.Timeout | null = null;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor(private serverUrl: string = process.env.REACT_APP_WEBSOCKET_URL || 'http://localhost:8000') {}

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve();
        return;
      }

      this.connectionStatus.isConnecting = true;
      
      this.socket = io(this.serverUrl, {
        transports: ['websocket', 'polling'],
        timeout: 20000,
        reconnection: false,
        autoConnect: true
      });

      this.socket.on('connect', () => {
        this.connectionStatus.isConnected = true;
        this.connectionStatus.isConnecting = false;
        this.connectionStatus.lastConnected = new Date();
        this.connectionStatus.reconnectAttempts = 0;
        this.reconnectDelay = 1000; // Reset delay
        
        // Clear any existing reconnect interval
        if (this.reconnectInterval) {
          clearTimeout(this.reconnectInterval);
          this.reconnectInterval = null;
        }

        this.emit(WebSocketEventType.CONNECT, { timestamp: new Date().toISOString() });
        resolve();
      });

      this.socket.on('disconnect', (reason) => {
        console.log('WebSocket disconnected:', reason);
        this.connectionStatus.isConnected = false;
        this.connectionStatus.lastDisconnected = new Date();
        this.emit(WebSocketEventType.DISCONNECT, { reason, timestamp: new Date().toISOString() });

        if (reason !== 'io client disconnect' && reason !== 'io server disconnect') {
          this.attemptReconnect();
        }
      });

      this.socket.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error);
        this.connectionStatus.isConnecting = false;
        this.emit(WebSocketEventType.ERROR, { 
          code: 'CONNECTION_ERROR', 
          message: error.message,
          details: error 
        });
        reject(error);
      });

      this.socket.on(WebSocketEventType.PROMOTION_CREATED, (data: PromotionCreatedMessage) => {
        this.handlePromotionEvent(WebSocketEventType.PROMOTION_CREATED, data);
      });

      this.socket.on(WebSocketEventType.PROMOTION_UPDATED, (data: PromotionUpdatedMessage) => {
        this.handlePromotionEvent(WebSocketEventType.PROMOTION_UPDATED, data);
      });

      this.socket.on(WebSocketEventType.PROMOTION_DELETED, (data: PromotionDeletedMessage) => {
        this.handlePromotionEvent(WebSocketEventType.PROMOTION_DELETED, data);
      });
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    
    if (this.reconnectInterval) {
      clearTimeout(this.reconnectInterval);
      this.reconnectInterval = null;
    }
    
    this.connectionStatus.isConnected = false;
    this.connectionStatus.isConnecting = false;
  }

  private attemptReconnect(): void {
    if (this.connectionStatus.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnection attempts reached');
      return;
    }

    this.connectionStatus.reconnectAttempts++;
    this.reconnectDelay = Math.min(this.reconnectDelay * 2, 30000); // Exponential backoff, max 30s

    console.log(`Attempting to reconnect in ${this.reconnectDelay}ms (attempt ${this.connectionStatus.reconnectAttempts})`);

    this.reconnectInterval = setTimeout(() => {
      this.connect().catch((error) => {
        console.error('Reconnection failed:', error);
        this.attemptReconnect();
      });
    }, this.reconnectDelay);
  }

  private handlePromotionEvent(eventType: WebSocketEventType, data: any): void {
    const message: WebSocketMessage = {
      type: eventType,
      data,
      timestamp: new Date().toISOString()
    };
    
    this.emit(eventType, message);
  }

  on(eventType: WebSocketEventType, callback: Function): void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, new Set());
    }
    this.eventListeners.get(eventType)!.add(callback);
  }

  off(eventType: WebSocketEventType, callback: Function): void {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      listeners.delete(callback);
    }
  }

  private emit(eventType: WebSocketEventType, data: any): void {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in WebSocket event listener for ${eventType}:`, error);
        }
      });
    }
  }

  getConnectionStatus(): WebSocketConnectionStatus {
    return { ...this.connectionStatus };
  }

  isConnected(): boolean {
    return this.connectionStatus.isConnected;
  }

  joinPromotionsRoom(): void {
    if (this.socket?.connected) {
      this.socket.emit('join_promotions_room');
    }
  }

  leavePromotionsRoom(): void {
    if (this.socket?.connected) {
      this.socket.emit('leave_promotions_room');
    }
  }
}

export const webSocketService = new WebSocketService(); 
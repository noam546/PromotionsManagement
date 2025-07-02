import { Promotion } from './promotionType';

export enum WebSocketEventType {
  PROMOTION_CREATED = 'promotion_created',
  PROMOTION_UPDATED = 'promotion_updated',
  PROMOTION_DELETED = 'promotion_deleted',
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  ERROR = 'error'
}

export interface WebSocketMessage<T = any> {
  type: WebSocketEventType;
  data: T;
  timestamp: string;
  userId?: string;
}

export interface PromotionCreatedMessage {
  promotion: Promotion;
}

export interface PromotionUpdatedMessage {
  promotion: Promotion;
  previousData?: Partial<Promotion>;
}

export interface PromotionDeletedMessage {
  promotionId: string;
}

export interface WebSocketError {
  code: string;
  message: string;
  details?: any;
}

export interface WebSocketConnectionStatus {
  isConnected: boolean;
  isConnecting: boolean;
  lastConnected?: Date;
  lastDisconnected?: Date;
  reconnectAttempts: number;
} 
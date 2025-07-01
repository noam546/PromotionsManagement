# WebSocket Implementation for Promotions Management

This project now includes a comprehensive WebSocket implementation for real-time updates in the promotions management system.

## Features

- **Real-time Notifications**: Get instant notifications when promotions are created, updated, deleted, or have status changes
- **Connection Management**: Automatic reconnection with exponential backoff
- **Room-based Communication**: Join/leave specific rooms for targeted updates
- **Connection Status Monitoring**: Visual indicators for connection status
- **Error Handling**: Robust error handling and recovery mechanisms

## Architecture

### Frontend Components

1. **WebSocketService** (`src/api/websocket.ts`)
   - Core WebSocket service using Socket.IO client
   - Handles connection, reconnection, and event management
   - Singleton pattern for app-wide usage

2. **useWebSocket Hook** (`src/hooks/useWebSocket.ts`)
   - React hook for easy WebSocket integration
   - Provides connection status and event handlers
   - Automatic cleanup on component unmount

3. **WebSocketStatus Component** (`src/components/WebSocketStatus.tsx`)
   - Visual connection status indicator
   - Manual connect/disconnect controls
   - Connection statistics display

4. **WebSocketNotifications Component** (`src/components/WebSocketNotifications.tsx`)
   - Real-time notification display
   - Auto-hide functionality
   - Different styles for different event types

### Backend Server

- **Express + Socket.IO Server** (`server/websocket-server.js`)
  - Handles WebSocket connections
  - Room-based event broadcasting
  - Simulated promotion events for testing
  - REST API endpoints for manual event emission

## Setup Instructions

### 1. Install Dependencies

```bash
# Frontend dependencies (already installed)
yarn add socket.io-client

# Backend dependencies
cd server
npm install
```

### 2. Start the WebSocket Server

```bash
cd server
npm start
# or for development with auto-restart
npm run dev
```

The server will start on `http://localhost:3001`

### 3. Start the React App

```bash
# In the project root
yarn start
```

The React app will start on `http://localhost:3000`

## Usage

### Basic WebSocket Integration

```tsx
import { useWebSocket } from './hooks/useWebSocket';

function MyComponent() {
  const { 
    isConnected, 
    onPromotionCreated, 
    onPromotionUpdated 
  } = useWebSocket();

  useEffect(() => {
    onPromotionCreated((data) => {
      console.log('New promotion:', data.data.promotion);
    });

    onPromotionUpdated((data) => {
      console.log('Promotion updated:', data.data.promotion);
    });
  }, [onPromotionCreated, onPromotionUpdated]);

  return (
    <div>
      <p>Connection status: {isConnected ? 'Connected' : 'Disconnected'}</p>
    </div>
  );
}
```

### Manual Connection Control

```tsx
import { useWebSocket } from './hooks/useWebSocket';

function ConnectionControl() {
  const { 
    isConnected, 
    isConnecting, 
    connect, 
    disconnect 
  } = useWebSocket({ autoConnect: false });

  return (
    <div>
      {!isConnected && !isConnecting && (
        <button onClick={connect}>Connect</button>
      )}
      {isConnected && (
        <button onClick={disconnect}>Disconnect</button>
      )}
      {isConnecting && <span>Connecting...</span>}
    </div>
  );
}
```

### Room Management

```tsx
import { useWebSocket } from './hooks/useWebSocket';

function RoomManager() {
  const { 
    joinPromotionsRoom, 
    leavePromotionsRoom 
  } = useWebSocket();

  return (
    <div>
      <button onClick={joinPromotionsRoom}>Join Promotions Room</button>
      <button onClick={leavePromotionsRoom}>Leave Promotions Room</button>
    </div>
  );
}
```

## WebSocket Events

### Event Types

- `promotion_created` - New promotion created
- `promotion_updated` - Existing promotion updated
- `promotion_deleted` - Promotion deleted
- `promotion_status_changed` - Promotion status changed
- `connect` - WebSocket connected
- `disconnect` - WebSocket disconnected
- `error` - WebSocket error occurred

### Event Data Structure

```typescript
interface WebSocketMessage<T = any> {
  type: WebSocketEventType;
  data: T;
  timestamp: string;
  userId?: string;
}
```

## Testing

### Manual Event Emission

You can manually emit events using the server's REST API:

```bash
# Emit a promotion created event
curl -X POST http://localhost:3001/api/emit-event \
  -H "Content-Type: application/json" \
  -d '{
    "eventType": "promotion_created",
    "data": {
      "promotion": {
        "id": "test-001",
        "promotionName": "Test Promotion",
        "type": "discount",
        "startDate": "2024-01-01T00:00:00Z",
        "endDate": "2024-12-31T23:59:59Z",
        "userGroupName": "Test Users"
      }
    }
  }'
```

### Server Health Check

```bash
curl http://localhost:3001/api/health
```

## Configuration

### WebSocket Service Configuration

You can customize the WebSocket service behavior:

```typescript
// In src/api/websocket.ts
export class WebSocketService {
  private maxReconnectAttempts = 5;        // Max reconnection attempts
  private reconnectDelay = 1000;           // Initial reconnect delay (ms)
  // Exponential backoff with max 30s delay
}
```

### Hook Options

```typescript
const { isConnected } = useWebSocket({
  autoConnect: true,           // Auto-connect on mount
  autoJoinPromotionsRoom: true // Auto-join promotions room
});
```

### Notification Component Options

```tsx
<WebSocketNotifications
  maxNotifications={5}     // Max notifications to show
  autoHide={true}          // Auto-hide notifications
  hideDelay={5000}         // Hide delay in milliseconds
/>
```

## Error Handling

The WebSocket implementation includes comprehensive error handling:

- **Connection Errors**: Automatic retry with exponential backoff
- **Event Listener Errors**: Individual error handling for each listener
- **Network Issues**: Graceful degradation and reconnection
- **Server Errors**: Error event emission for UI feedback

## Production Considerations

1. **Environment Variables**: Use environment variables for server URLs
2. **SSL/TLS**: Use secure WebSocket connections in production
3. **Authentication**: Implement proper authentication for WebSocket connections
4. **Rate Limiting**: Add rate limiting for event emission
5. **Monitoring**: Add logging and monitoring for WebSocket connections
6. **Load Balancing**: Consider WebSocket-aware load balancing

## Troubleshooting

### Common Issues

1. **Connection Refused**: Ensure the WebSocket server is running on the correct port
2. **CORS Errors**: Check that CORS is properly configured on the server
3. **Events Not Received**: Verify that clients have joined the correct room
4. **Memory Leaks**: Ensure event listeners are properly cleaned up

### Debug Mode

Enable debug logging by setting the environment variable:

```bash
DEBUG=socket.io:* npm start
```

## API Reference

### WebSocketService Methods

- `connect()`: Connect to WebSocket server
- `disconnect()`: Disconnect from server
- `on(eventType, callback)`: Add event listener
- `off(eventType, callback)`: Remove event listener
- `joinPromotionsRoom()`: Join promotions room
- `leavePromotionsRoom()`: Leave promotions room
- `isConnected()`: Check connection status
- `getConnectionStatus()`: Get detailed connection status

### useWebSocket Hook Return Values

- `isConnected`: Boolean connection status
- `isConnecting`: Boolean connecting status
- `connectionStatus`: Detailed connection information
- `connect`: Connect function
- `disconnect`: Disconnect function
- `onPromotionCreated`: Event handler for promotion creation
- `onPromotionUpdated`: Event handler for promotion updates
- `onPromotionDeleted`: Event handler for promotion deletion
- `onPromotionStatusChanged`: Event handler for status changes
- `onConnect`: Connection event handler
- `onDisconnect`: Disconnection event handler
- `onError`: Error event handler 
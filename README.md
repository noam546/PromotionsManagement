# Promotions Management System

A modern React-based promotions management application with real-time WebSocket updates, built with TypeScript and Material-UI.

## 🚀 Features

- **Real-time Updates**: WebSocket integration for live promotion updates
- **Virtualized Table**: High-performance table with infinite scrolling for large datasets
- **Advanced Filtering**: Search, date range, and type-based filtering
- **Sorting**: Multi-column sorting with visual indicators
- **Responsive Design**: Modern UI built with Material-UI components
- **TypeScript**: Full type safety throughout the application
- **React Query**: Efficient data fetching and caching
- **URL State Management**: Filters and sorting state preserved in URL

## 🏗️ Architecture

### Frontend Stack

- **React 18** with TypeScript
- **Material-UI (MUI)** for UI components
- **React Query (TanStack Query)** for data management
- **React Virtual** for performance optimization
- **Socket.IO Client** for real-time updates
- **React Router** for navigation
- **Day.js** for date handling
- **Zod** for schema validation

### Project Structure

```
src/
├── api/                    # API layer and types
│   ├── index.ts           # API client setup
│   ├── promotion.ts       # Promotion API endpoints
│   ├── websocket.ts       # WebSocket service
│   └── types/             # TypeScript type definitions
├── components/            # Reusable UI components
│   ├── icons/            # SVG icons
│   ├── logo/             # Logo component
│   ├── table/            # Table components
│   └── promotionsFilters.tsx
├── hooks/                # Custom React hooks
│   ├── useWebSocket.ts   # WebSocket hook
│   └── useWebSocketTableUpdates.ts
├── pages/                # Page components
│   └── PromotionsPage.tsx
└── utils/                # Utility functions
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- Yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd PromotionsManagement
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Start the development server**
   ```bash
   yarn start
   ```

The application will be available at `http://localhost:3000`

### Build for Production

```bash
yarn build
```

## 📖 Usage

### Main Features

#### 1. Promotions Table
- View all promotions in a high-performance virtualized table
- Infinite scrolling for large datasets
- Sort by any column (Promotion Name, Type, Start Date, End Date, User Group Name)

#### 2. Advanced Filtering
- **Search**: Filter by promotion name
- **Type Filter**: Filter by promotion type (Common, Epic, Basic)
- **Date Range**: Filter by start and end dates
- **Clear Filters**: Reset all filters to default state

#### 3. Real-time Updates
- Automatic WebSocket connection for live updates
- Real-time notifications for promotion changes
- Connection status monitoring

### WebSocket Integration

The application includes comprehensive WebSocket support for real-time updates:

```tsx
import { useWebSocket } from './hooks/useWebSocket';

function MyComponent() {
  const { isConnected, onPromotionCreated } = useWebSocket();

  useEffect(() => {
    onPromotionCreated((data) => {
      console.log('New promotion:', data.data.promotion);
    });
  }, [onPromotionCreated]);

  return (
    <div>
      Connection status: {isConnected ? 'Connected' : 'Disconnected'}
    </div>
  );
}
```

## 🔧 Configuration

### Environment Variables

The application uses a proxy configuration for API calls:

```json
{
  "proxy": "http://localhost:8000"
}
```

### WebSocket Configuration

WebSocket settings can be customized in `src/api/websocket.ts`:

```typescript
export class WebSocketService {
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  // Exponential backoff with max 30s delay
}
```

## 🧪 Testing

```bash
# Run tests
yarn test

# Run tests in watch mode
yarn test --watch
```

## 📦 Dependencies

### Core Dependencies
- `react`: ^18.2.0
- `react-dom`: ^18.2.0
- `typescript`: ^4.4.2
- `@mui/material`: ^7.2.0
- `@tanstack/react-query`: ^5.81.5
- `@tanstack/react-virtual`: ^3.13.12
- `socket.io-client`: ^4.8.1

### Development Dependencies
- `@faker-js/faker`: ^8.2.0 (for generating test data)

## 🚀 Performance Features

- **Virtualized Table**: Only renders visible rows for optimal performance
- **Infinite Scrolling**: Loads data on-demand to handle large datasets
- **React Query Caching**: Intelligent caching and background updates
- **Optimized Re-renders**: Minimal component re-renders with proper memoization

## 🔒 Security Considerations

- TypeScript for type safety
- Input validation with Zod schemas
- Secure WebSocket connections (in production)
- Proper error handling and user feedback

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **WebSocket Connection Issues**
   - Ensure the backend server is running
   - Check CORS configuration
   - Verify WebSocket server URL

2. **Build Errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && yarn install`
   - Check TypeScript configuration
   - Verify all dependencies are compatible

3. **Performance Issues**
   - Check browser console for memory leaks
   - Verify virtualized table is working correctly
   - Monitor WebSocket connection status

### Debug Mode

Enable debug logging for WebSocket:

```bash
DEBUG=socket.io:* yarn start
```

## 📞 Support

For support and questions, please refer to the project documentation or create an issue in the repository. 
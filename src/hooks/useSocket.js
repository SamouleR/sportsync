import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../App.jsx';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Singleton socket instance to avoid multiple connections
let socketInstance = null;

export const useSocket = () => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!socketInstance) {
      socketInstance = io(SOCKET_URL, {
        autoConnect: true,
        reconnection: true,
      });
    }
    
    socketRef.current = socketInstance;

    const onConnect = () => {
      setIsConnected(true);
      if (user?.team) {
        socketInstance.emit('joinTeam', user.team);
      }
    };

    const onDisconnect = () => setIsConnected(false);

    socketInstance.on('connect', onConnect);
    socketInstance.on('disconnect', onDisconnect);

    // Initial state
    setIsConnected(socketInstance.connected);
    if (socketInstance.connected && user?.team) {
      socketInstance.emit('joinTeam', user.team);
    }

    return () => {
      socketInstance.off('connect', onConnect);
      socketInstance.off('disconnect', onDisconnect);
    };
  }, [user]);

  // Helper to subscribe to specific events
  const subscribe = (event, callback) => {
    if (!socketRef.current) return;
    socketRef.current.on(event, callback);
    return () => socketRef.current.off(event, callback);
  };

  // Helper to emit events
  const emit = (event, data) => {
    if (!socketRef.current || !isConnected) return;
    socketRef.current.emit(event, data);
  };

  return { isConnected, subscribe, emit, socket: socketRef.current };
};

'use client'
import { SocketContext } from "@/contexts/socket/socket-context";
import { SocketEvents } from "@/shared/enums/socket-events";
import { SocketProps, SocketProviderProps } from "@/shared/interfaces/socket";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { io, Socket } from 'socket.io-client';

export const SocketProvider: React.FC<SocketProviderProps> = ({
  children,
  url = 'http://192.168.10.33:8089'
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastError, setLastError] = useState<Error | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    socketRef.current = io(url, {
      transports: ['websocket'],
      reconnection: false,
    });

    socketRef.current.on('connect', () => {
      setIsConnected(true);
      setLastError(null);
    });

    socketRef.current.on('disconnect', (reason) => {
      setIsConnected(false);
      if (reason === 'io server disconnect') {
        reconnectTimeoutRef.current = setTimeout(() => connect(), 1000);
      }
    });

    socketRef.current.on('connect_error', (error: Error) => {
      setLastError(error);
      reconnectTimeoutRef.current = setTimeout(() => connect(), 5000);
    });
  }, [url]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
  }, []);

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  const emit = useCallback(<T,>(event: SocketEvents, data?: T) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    } else {
      console.warn('Socket is not connected. Unable to emit event:', event);
    }
  }, []);

  const on = useCallback(<T,>(event: SocketEvents, callback: (data: T) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
      return () => {
        socketRef.current?.off(event, callback);
      };
    }
    return () => { };
  }, []);

  const off = useCallback(<T,>(event: SocketEvents, callback: (data: T) => void) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback);
    }
  }, []);

  const contextValue = useMemo<SocketProps>(() => ({
    isConnected,
    lastError,
    emit,
    on,
    off
  }), [isConnected, lastError, emit, on]);

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};
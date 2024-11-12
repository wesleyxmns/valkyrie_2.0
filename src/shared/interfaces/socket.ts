import { SocketEvents } from "../enums/socket-events";

export interface SocketProps {
  isConnected: boolean;
  lastError: Error | null;
  emit: <T>(event: SocketEvents, data?: T) => void;
  on: <T>(event: SocketEvents, callback: (data: T) => void) => () => void;
  off: <T>(event: SocketEvents, callback: (data: T) => void) => void;
}

export interface SocketProviderProps {
  children: React.ReactNode;
  url?: string;
}
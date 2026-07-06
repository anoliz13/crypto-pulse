import { useEffect, useRef, useState, useCallback } from 'react';
import { WebSocketManager, WebSocketConnectionStatus } from '../services/websocket';
import type { WebSocketMessage } from '../types';

interface UseWebSocketResult {
  status: WebSocketConnectionStatus;
  lastMessage: WebSocketMessage | null;
  send: (data: Record<string, unknown>) => void;
}

export function useWebSocket(onMessage?: (msg: WebSocketMessage) => void): UseWebSocketResult {
  const managerRef = useRef<WebSocketManager | null>(null);
  const [status, setStatus] = useState<WebSocketConnectionStatus>('disconnected');
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);

  useEffect(() => {
    const manager = new WebSocketManager();
    managerRef.current = manager;

    const unsubStatus = manager.onStatusChange(setStatus);
    const unsubMessage = manager.onMessage((data) => {
      const msg = data as WebSocketMessage;
      setLastMessage(msg);
      onMessage?.(msg);
    });

    manager.connect();

    return () => {
      unsubStatus();
      unsubMessage();
      manager.disconnect();
      managerRef.current = null;
    };
  }, []);

  const send = useCallback((data: Record<string, unknown>) => {
    managerRef.current?.send(data);
  }, []);

  return { status, lastMessage, send };
}

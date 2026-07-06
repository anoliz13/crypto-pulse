const WS_URL = process.env.EXPO_PUBLIC_WS_URL || 'ws://localhost:3001/ws';

type MessageHandler = (data: any) => void;
type StatusHandler = (status: WebSocketConnectionStatus) => void;

export type WebSocketConnectionStatus =
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'reconnecting';

export class WebSocketManager {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private messageHandlers: Set<MessageHandler> = new Set();
  private statusHandlers: Set<StatusHandler> = new Set();
  private _status: WebSocketConnectionStatus = 'disconnected';
  private shouldReconnect = true;

  constructor(url?: string) {
    this.url = url || WS_URL;
  }

  get status(): WebSocketConnectionStatus {
    return this._status;
  }

  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    this.shouldReconnect = true;
    this.setStatus('connecting');

    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        this.reconnectAttempts = 0;
        this.setStatus('connected');
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.messageHandlers.forEach((handler) => handler(data));
        } catch {
          // raw message
        }
      };

      this.ws.onclose = () => {
        if (this.shouldReconnect) {
          this.scheduleReconnect();
        } else {
          this.setStatus('disconnected');
        }
      };

      this.ws.onerror = () => {
        // onclose will fire after this
      };
    } catch {
      this.scheduleReconnect();
    }
  }

  disconnect(): void {
    this.shouldReconnect = false;
    this.reconnectAttempts = this.maxReconnectAttempts;

    if (this.reconnectTimeoutId) {
      clearTimeout(this.reconnectTimeoutId);
      this.reconnectTimeoutId = null;
    }

    this.ws?.close();
    this.ws = null;
    this.setStatus('disconnected');
  }

  send(data: Record<string, unknown>): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  onMessage(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  onStatusChange(handler: StatusHandler): () => void {
    this.statusHandlers.add(handler);
    return () => this.statusHandlers.delete(handler);
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.setStatus('disconnected');
      return;
    }

    this.setStatus('reconnecting');
    const delay = Math.min(
      1000 * Math.pow(2, this.reconnectAttempts),
      30000
    );

    this.reconnectAttempts++;
    this.reconnectTimeoutId = setTimeout(() => this.connect(), delay);
  }

  private setStatus(status: WebSocketConnectionStatus): void {
    this._status = status;
    this.statusHandlers.forEach((handler) => handler(status));
  }
}

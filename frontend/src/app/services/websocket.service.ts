import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subscribable } from '../../utils/subscribable';
import { MessageService } from './message.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService extends Subscribable {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private reconnectTimer: any = null;
  private messageQueue: any[] = [];
  private shouldReconnect = true;
  private readonly maxReconnectAttempts = 8;

  constructor(
    private messageService: MessageService,
    private router: Router,
  ) {
    super();
    this.connect();
  }

  private get url(): string {
    return environment.production
      ? 'wss://api.werewolves.andreasnicklaus.de/ws'
      : 'ws://localhost:8080/ws';
  }

  connect(): void {
    if (!this.shouldReconnect) return;
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      this.publish((cb: any) => {
        if (cb.onopen) cb.onopen();
      });
      this.flushQueue();
    };

    this.ws.onmessage = (msg: any) => {
      try {
        this.publish((cb: any) => cb.onmessage(JSON.parse(msg.data)));
      } catch (e) {
        console.error('Failed to parse websocket message', e);
      }
    };

    this.ws.onclose = () => {
      console.warn('Websocket closed');
      this.publish((cb: any) => {
        if (cb.onclose) cb.onclose();
      });
      this.scheduleReconnect();
    };

    this.ws.onerror = () => {
      console.warn('Websocket error');
      this.messageService.addMessage('Websocket error');
    };
  }

  private scheduleReconnect(): void {
    if (!this.shouldReconnect) return;
    if (this.reconnectTimer) return;
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.messageService.addMessage('Websocket connection lost');
      this.router.navigate(['/']);
      this.publish((cb: any) => {
        if (cb.ongiveup) cb.ongiveup();
      });
      return;
    }

    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000);
    this.reconnectAttempts += 1;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, delay);
  }

  isConnected(): boolean {
    return !!this.ws && this.ws.readyState === WebSocket.OPEN;
  }

  sendMessage(message: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      this.messageQueue.push(message);
    }
  }

  private flushQueue(): void {
    while (this.messageQueue.length > 0 && this.ws && this.ws.readyState === WebSocket.OPEN) {
      const next = this.messageQueue.shift();
      this.ws.send(JSON.stringify(next));
    }
  }

  close(): void {
    this.shouldReconnect = false;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.close();
    }
  }
}
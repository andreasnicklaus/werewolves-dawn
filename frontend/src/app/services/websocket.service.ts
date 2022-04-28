import { Injectable } from '@angular/core';
import {Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  ws = new WebSocket("ws://localhost:8080");
  messages: string[] = [];

  constructor() {
    this.ws.onmessage = (msg:any) => {
      console.log(JSON.parse(msg.data))
      this.messages.push(JSON.parse(msg.data).message)
    }
  }

  getMessages(): Observable<string[]> {
    return of(this.messages)
  }

  sendMessage(message: any): void {
    this.ws.send(JSON.stringify(message))
  }
}

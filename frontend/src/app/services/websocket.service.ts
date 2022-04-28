import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {Subscribable} from "../../utils/subscribable";
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService extends Subscribable {
  ws = new WebSocket(`ws://${window.location.hostname}:8080`);

  constructor(private messageService:MessageService, private router:Router) {
    super()
    this.ws.onmessage = (msg:any) => {
      this.publish((cb: any) => cb.onmessage(JSON.parse(msg.data)))
    }
    this.ws.onclose = _ => {
      console.warn("Websocket closed")
      this.messageService.addMessage("Weboscket closed")
      this.router.navigate(["/"])
    }
    this.ws.onerror = _ => {
      console.warn("Websocket error")
      this.messageService.addMessage("Weboscket error")
      this.router.navigate(["/"])
    }
  }

  sendMessage(message: any): void {
    this.ws.send(JSON.stringify(message))
  }
}

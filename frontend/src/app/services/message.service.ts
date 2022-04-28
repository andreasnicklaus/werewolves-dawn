import { Injectable } from '@angular/core';
import {Subscribable} from "../../utils/subscribable";

@Injectable({
  providedIn: 'root'
})
export class MessageService extends Subscribable {
  currentMessage?: string;

  addMessage(msg: string) {
    this.currentMessage = msg;
    this.publish((cb: any) => cb.onMessage(this.currentMessage))
  }
}

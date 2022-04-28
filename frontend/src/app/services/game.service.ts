import {Injectable} from '@angular/core';
import {Observable, of} from "rxjs";
import {WebsocketService} from "./services/websocket.service";
import {Subscribable} from "../utils/subscribable";

@Injectable({
  providedIn: 'root'
})
export class GameService extends Subscribable {
  game: Object | undefined;

  constructor(private ws: WebsocketService) {
    super()
    ws.subscribe({
        onmessage: (msg: any) => {
          console.log("GameService callback:", msg)
          this.game = msg
          this.publish((cb: any) => cb.onGameChange(this.game))
        }
      }
    )
  }

  join() {
    this.ws.sendMessage({
      meta: "join",
      name: "Andi"
    })
  }

  setupRoles(): void {
    this.ws.sendMessage({
      meta: "setupRoles",
      roles: [
        {"name": "guardian", "order": 0, "team": "villagers"},
        {"name": "werewolf", "order": 1, "team": "werewolves"}
      ]
    })
  }

  startGame() {
    this.ws.sendMessage({
      meta: "startGame",
    })
  }

  vote() {
    this.ws.sendMessage({
      meta: "vote",
      name: "Andi"
    })
  }
}

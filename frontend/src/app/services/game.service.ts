import {Injectable} from '@angular/core';
import {WebsocketService} from "./websocket.service";
import {Subscribable} from "../../utils/subscribable";
import {WerewolfGame} from "../interfaces/werewolf-game";
import {MessageService} from "./message.service";
import {Role} from "../interfaces/role";
import { CdkVirtualForOf } from '@angular/cdk/scrolling';

@Injectable({
  providedIn: 'root'
})
export class GameService extends Subscribable {
  game: WerewolfGame | undefined;
  myName: string | undefined;

  constructor(private ws: WebsocketService, private ms: MessageService) {
    super();
    ws.subscribe({onmessage: this.handleMessage});
  }

  private handleMessage = (msg: any) => {
    console.log("GameService/handleMessage received:", msg)
    const {type, winnerFriendly, roleAfterTheRound, uncoveredRole, playersWithActions} = msg
    if (type === "winnerDetermined") {
      this.ms.addMessage(`Winner: ${winnerFriendly? "Villagers": "Werewolves"}`)
      this.publish((cb:any) => {if (cb.onWinnerDetermined) cb.onWinnerDetermined(winnerFriendly, roleAfterTheRound)})
    } else if (type === "gameStart") {
      this.ms.addMessage("The game starts now!")
    } else if (type === "NextPlayer") {
      this.publish((cb:any) => {if (cb.onNextPlayer) cb.onNextPlayer()})
    } else if (type === "YourTurn") {
      this.ms.addMessage(`Your turn, ${this.myName}!`)
      this.publish((cb: any) => {if (cb.onYourTurn) cb.onYourTurn()})
    } else if (type === "RoundEnd") {
      this.publish((cb:any) => {if (cb.onRoundEnd) cb.onRoundEnd()})
      this.ms.addMessage("The round ended!")
    } else if(type === "UncoveredCard") {
      this.publish((cb: any) => {if (cb.onUncoveredCard) cb.onUncoveredCard(uncoveredRole)})
      this.ms.addMessage(`You uncovered card: ${uncoveredRole.name}`)
    } else if (type === "actionPlayers") {
      console.log("GameService playersWithActions", playersWithActions)
      this.publish((cb:any) => {if (cb.onActionPlayerList) cb.onActionPlayerList(playersWithActions)})
    } else {
      this.game = msg
      this.publish((cb: any) => {if (cb.onGameChange)cb.onGameChange(this.game)})
    }
  }

  getGame():WerewolfGame | undefined {
    return this.game
  }

  join(name:string, roomCode?:string) {
    this.myName = name;
    this.ws.sendMessage({
      meta: "join",
      name,
      roomCode
    })
  }

  setupRoles(selectedRoles: Role[]): void {
    this.ws.sendMessage({
      meta: "setupRoles",
      roles: selectedRoles
    })
  }

  startGame() {
    this.ws.sendMessage({
      meta: "startGame",
    })
  }

  vote(uuid: string) {
    console.log("Sending vote for", uuid)
    this.ws.sendMessage({
      meta: "voteGiven",
      voteFor: uuid
    })
  }

  leave() {
    this.ws.sendMessage({
      meta: "leave"
    })
  }

  getOwnRole() {
    return this.getOwnPlayerInfo()?.role
  }

  getOwnPlayerInfo() {
    return this.game?.playerList.find(player => player.name === this.myName)
  }

  sendWardenMove(selectedPlayerUUID: string) {
    this.ws.sendMessage({
      meta: "wardenAction",
      selectedPlayerUUID
    })
  }

  uncoverMiddleCard(selectedIndex: number) {
    this.ws.sendMessage({
      meta: "uncoverMiddleCard",
      selectedIndex
    })
  }

  sendAlphawolfMove(selectedPlayerUUID: string) {
    this.ws.sendMessage({
      meta: "alphaWolfAction",
      selectedPlayerUUID
    })
  }

  sendSeeingwolfMove(selectedPlayerUUID: string) {
    this.ws.sendMessage({
      meta: "seeingWolfAction",
      selectedPlayerUUID
    })
  }

  sendGhostBusterMove(selectedPlayerUUID: string) {
    this.ws.sendMessage({
      meta: "ghostBusterAction",
      selectedPlayerUUID
    })
  }

  sendWitchMove(selectedIndex:number, selectedPlayerUUID:string) {
    this.ws.sendMessage({
      meta: "witchAction",
      selectedIndex,
      selectedPlayerUUID
    })
  }

  sendIdiotMove(left: boolean) {
    this.ws.sendMessage({
      meta: "idiotAction",
      left
    })
  }

  sendFortuneTellerMove() {
    this.ws.sendMessage({
      meta: "fortuneTellerAction"
    })
  }

  sendScoutMove(selectedIndex: number) {
    this.ws.sendMessage({
      meta: "scoutAction",
      selectedIndex
    })
  }
}

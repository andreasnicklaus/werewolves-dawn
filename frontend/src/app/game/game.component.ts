import { VoteDialogComponent } from './dialogs/vote-dialog/vote-dialog.component';
import { Role } from './../interfaces/role';
import {Component, OnDestroy, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {WerewolfGame} from "../interfaces/werewolf-game";
import {GameService} from "../services/game.service";
import { GameSettingsDialogComponent } from './dialogs/game-settings-dialog/game-settings-dialog.component';
import { RoomInfoDialogComponent } from './dialogs/room-info-dialog/room-info-dialog.component';
import ROLES from 'src/app/data/roles.json';
import {YourTurnDialogComponent} from "./dialogs/your-turn-dialog/your-turn-dialog.component";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {
  game?: WerewolfGame

  constructor(
    public gameService:GameService,
    private roomInfoDialog:MatDialog,
    private gameSettingsDialog:MatDialog,
    private yourTurnDialog:MatDialog,
    private voteDialog:MatDialog
  ) { }

  ngOnInit(): void {
    this.gameService.subscribe({
      onGameChange: this.updateGame,
      onYourTurn: this.yourTurn,
      onRoundEnd: this.openVoteDialog
    })
    this.game = this.gameService.game
  }
  ngOnDestroy(): void {
    this.gameService.leave()
    this.gameService.unsubscribe({
      onGameChange: this.updateGame,
      onYourTurn: this.yourTurn
    })
    this.roomInfoDialog.closeAll()
    this.gameSettingsDialog.closeAll()
    this.yourTurnDialog.closeAll()
  }

  yourTurn = ():void => {
    this.yourTurnDialog.open(YourTurnDialogComponent, {
      data: {role: this.gameService.getOwnRole(), game: this.game}
    })
  }

  rooted(length:number = 4) :number {
    return Math.sqrt(length)
  }

  updateGame = (newGame: WerewolfGame) => {
    this.game = newGame
  }

  openSettings() {
    this.gameSettingsDialog.open(GameSettingsDialogComponent, {
      data: {selectedRoles: this.game?.roles, roles: ROLES},
      width: '80vw'
    })
  }

  openRoomInfo() {
    this.roomInfoDialog.open(RoomInfoDialogComponent, {
      data: {roomCode: this.game?.roomCode}
    })
  }

  getMiddleRoleAtIndex(index: number) :Role | undefined {
    if (!this.game?.middleRoles) return undefined
    return this.game?.middleRoles[index]
  }

  openVoteDialog = () => {
    this.voteDialog.open(VoteDialogComponent, {
      data: {game: this.game}
    })
  }

  numberOfRolesIsOk() {
    return (this.game?.roles?.length || 0) === ((this.game?.playerList.length || 0) + 2)
  }

}

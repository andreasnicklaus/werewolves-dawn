import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatDialogState } from "@angular/material/dialog";
import { MessageService } from "../../../services/message.service";
import { GameService } from "../../../services/game.service";
import { Role } from "../../../interfaces/role";
import { WerewolfGame } from "../../../interfaces/werewolf-game";
import { Player } from "../../../interfaces/player";
import { TurnDetailDialogComponent } from "./turn-detail-dialog/turn-detail-dialog.component";

@Component({
  selector: 'app-your-turn-dialog',
  templateUrl: './your-turn-dialog.component.html',
  styleUrls: ['./your-turn-dialog.component.scss']
})
export class YourTurnDialogComponent implements OnInit, OnDestroy {
  selectedPlayerUUID: string = "";
  selectedIndex: number | undefined;
  ghostBusterCardsOpened = 0;

  constructor(
    public dialogRef: MatDialogRef<YourTurnDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { role: Role, game: WerewolfGame },
    public gs: GameService,
    private ms: MessageService,
    private turnDetailDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.gs.subscribe({
      onNextPlayer: this.forceClose,
      onRoundEnd: this.forceClose,
      onUncoveredCard: this.uncoverCard,
      onActionPlayerList: this.onActionPlayerList
    })
  }

  ngOnDestroy(): void {
    this.gs.unsubscribe({
      onNextPlayer: this.forceClose,
      onRoundEnd: this.forceClose,
      onUncoveredCard: this.uncoverCard,
      onActionPlayerList: this.onActionPlayerList
    })
  }

  forceClose = () => {
    if (this.dialogRef.getState() === MatDialogState.OPEN) this.ms.addMessage("Your time ran out, you didn't complete your move")
    this.dialogRef.close()
  }

  close() {
    this.dialogRef.close()
  }

  wardenAction() {
    this.gs.sendWardenMove(this.selectedPlayerUUID)
    this.close()
  }

  getOtherWerewolves(): Player[] {
    return this.data.game.playerList.filter(p => p.role?.friendly === false)
  }

  unprotectedPlayers(): Player[] {
    // console.log("unprotectedPlayers", this.data.game.playerList.filter(p => !p.protectedByWarden))
    return this.data.game.playerList.filter(p => !p.protectedByWarden)
  }

  alphawolfAction() {
    this.gs.sendAlphawolfMove(this.selectedPlayerUUID)
    this.close()
  }

  getUnprotectedNonWerewolves(includeSelf = false) {
    let result = this.unprotectedPlayers().filter(p => p.role === undefined || p.role?.friendly)
    if (!includeSelf) result = result.filter(p => p.uuid !== this.gs.getOwnPlayerInfo()?.uuid)
    return result
  }

  seeingwolfAction() {
    this.gs.sendSeeingwolfMove(this.selectedPlayerUUID)
    this.close()
  }

  ghostBusterAction = () => {
    this.ghostBusterCardsOpened++;
    this.gs.sendGhostBusterMove(this.selectedPlayerUUID)
    this.close()
  }

  turnMiddleCard(middleCardIndex: number, closeAfter=true) {
    this.selectedIndex = middleCardIndex
    this.gs.uncoverMiddleCard(middleCardIndex)
    if (closeAfter) this.dialogRef.close()
  }

  youngSeerAction(middleCardIndex: number) {
    this.turnMiddleCard(middleCardIndex)
    this.dialogRef.close()
  }

  uncoverCard = (openedRole: Role) => {
    if (this.gs.getOwnRole()?.name === "Ghost buster") {
      if (this.ghostBusterCardsOpened < 2) {
        this.turnDetailDialog.open(TurnDetailDialogComponent, {
          data: {
            overTurnedRole: openedRole,
            myRole: this.gs.getOwnRole(),
            ghostBusterInfo: {
              selectedPlayerUUID: this.selectedPlayerUUID,
              playerList: this.getUnprotectedNonWerewolves(false),
              ghostBusterAction: this.ghostBusterAction
            }
          }
        })
      }
    } else if (this.gs.getOwnRole()?.name === "Witch") {
      this.turnDetailDialog.open(TurnDetailDialogComponent, {
        data: {
          overTurnedRole: openedRole,
          myRole: this.gs.getOwnRole(),
          witchInfo: {
            selectedPlayerUUID: this.selectedPlayerUUID,
            playerList: this.getUnprotectedNonWerewolves(false),
            witchAction: this.witchAction
          }
        }
      })
    } else {
      this.turnDetailDialog.open(TurnDetailDialogComponent, {
        data: {
          overTurnedRole: openedRole,
          myRole: this.gs.getOwnRole()
        }
      })
    }

  }

  isLonelyWerewolf() {
    if (this.gs.getOwnRole()?.friendly) return false
    else {
      return this.data.game.playerList.filter(p => p.role?.friendly == false).length <= 1
    }
  }

  witchAction = (playerUUID:string) => {
    this.gs.sendWitchMove(this.selectedIndex || 0, playerUUID)
  }

  idiotAction(left=true) {
    this.gs.sendIdiotMove(left)
    this.close()
  }

  fortuneTellerAction() {
    this.gs.sendFortuneTellerMove()
    this.close()
  }

  onActionPlayerList = (actionPlayers: {uuid: string, name:string}[]) => {
    console.log("fortuneTellerAction", actionPlayers)
    this.turnDetailDialog.open(TurnDetailDialogComponent, {
      data: {
        myRole: this.gs.getOwnRole(),
        fortuneTellerInfo: {actionPlayers}
      }
    })
  }

  getScoutOptions(): Player[] {
    return this.unprotectedPlayers().filter(player => player.uuid !== this.gs.getOwnPlayerInfo()?.uuid)
  }

  scoutAction(selectedIndex: number) {
    this.gs.sendScoutMove(selectedIndex)
    this.close()
  }

}

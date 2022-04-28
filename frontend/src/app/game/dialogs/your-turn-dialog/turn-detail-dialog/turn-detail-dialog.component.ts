import { GameService } from './../../../../services/game.service';
import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import { Player } from 'src/app/interfaces/player';
import {Role} from "../../../../interfaces/role";

@Component({
  selector: 'app-turn-detail-dialog',
  templateUrl: './turn-detail-dialog.component.html',
  styleUrls: ['./turn-detail-dialog.component.scss']
})
export class TurnDetailDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<TurnDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      overTurnedRole: Role,
      myRole?: Role,
      ghostBusterInfo: {
        selectedPlayerUUID:string,
        playerList: Player[],
        ghostBusterAction: Function
      },
      witchInfo: {
        selectedPlayerUUID:string,
        playerList: Player[],
        witchAction: Function
      },
      fortuneTellerInfo: {
        actionPlayers: {uuid:string, name:string}[]
      }
    },
    private gs:GameService
  ) { }

  ngOnInit(): void {
    console.log("DATA", this.data)
    this.gs.subscribe({
      onNextPlayer: this.close,
      onRoundEnd: this.close,
    })
  }

  close = () => this.dialogRef.close()

  ghostBusterAction() {
    this.data.ghostBusterInfo.ghostBusterAction()
    this.close()
  }

  witchAction() {
    this.data.witchInfo.witchAction(this.data.witchInfo.selectedPlayerUUID)
    this.close()
  }

}

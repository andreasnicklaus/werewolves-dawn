import { Role } from './../../../interfaces/role';
import { FinalDialogComponent } from './final-dialog/final-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { WerewolfGame } from './../../../interfaces/werewolf-game';
import { GameService } from './../../../services/game.service';
import { Component, Inject, OnInit, OnDestroy} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-vote-dialog',
  templateUrl: './vote-dialog.component.html',
  styleUrls: ['./vote-dialog.component.scss']
})
export class VoteDialogComponent implements OnInit, OnDestroy {
  voteGiven = false;
  votedFor = "";

  constructor(
    public dialogRef: MatDialogRef<VoteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { game: WerewolfGame },
    private finalDialog: MatDialog,
    private gs: GameService
  ) { }

  ngOnInit(): void {
    this.gs.subscribe({
      onWinnerDetermined: this.openFinalDialog
    })
  }

  ngOnDestroy(): void {
    this.gs.unsubscribe({
      onWinnerDetermined: this.openFinalDialog
    })
  }

  getVoteOptions() {
    return this.data.game.playerList
      .filter(player => player.uuid !== this.gs.getOwnPlayerInfo()?.uuid)
      .map(player => ({ uuid: player.uuid, name: player.name }))
  }

  vote(uuid:string) {
    console.log("Voting for", uuid)
    this.gs.vote(uuid)
    this.votedFor = this.gs.game?.playerList.find(player => player.uuid === uuid)?.name || ""
  }

  openFinalDialog = (winnerFriendly: Boolean, roleAfterTheRound: Role) => {
    this.finalDialog.open(FinalDialogComponent, {
      data: {winnerFriendly, roleAfterTheRound}
    })
    this.dialogRef.close()
  }

}

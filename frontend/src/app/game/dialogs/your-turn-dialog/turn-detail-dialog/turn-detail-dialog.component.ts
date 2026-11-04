import { GameService } from './../../../../services/game.service';
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Player } from 'src/app/interfaces/player';
import { Role } from '../../../../interfaces/role';

import { SHARED_IMPORTS } from '../../../../shared-imports';

@Component({
  standalone: true,
  imports: [...SHARED_IMPORTS],
  selector: 'app-turn-detail-dialog',
  templateUrl: './turn-detail-dialog.component.html',
  styleUrls: ['./turn-detail-dialog.component.scss'],
})
export class TurnDetailDialogComponent implements OnInit, OnDestroy {
  constructor(
    public dialogRef: MatDialogRef<TurnDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      overTurnedRole: Role;
      myRole?: Role;
      ghostBusterInfo: {
        selectedPlayerUUID: string;
        playerList: Player[];
        ghostBusterAction: Function;
      };
      witchInfo: {
        selectedPlayerUUID: string;
        playerList: Player[];
        witchAction: Function;
      };
      fortuneTellerInfo: {
        actionPlayers: { uuid: string; name: string }[];
      };
    },
    private gs: GameService,
  ) {}

  private unsub?: () => void;

  ngOnInit(): void {
    this.unsub = this.gs.subscribe({
      onNextPlayer: this.close,
      onRoundEnd: this.close,
      onGameStart: this.close,
    });
  }

  ngOnDestroy(): void {
    this.unsub?.();
  }

  get turnedTeamLabel(): string {
    return this.data.overTurnedRole?.friendly ? 'Villager' : 'Werewolf';
  }

  close = () => this.dialogRef.close();

  ghostBusterAction() {
    this.data.ghostBusterInfo.ghostBusterAction();
    this.close();
  }

  witchAction() {
    this.data.witchInfo.witchAction(this.data.witchInfo.selectedPlayerUUID);
    this.close();
  }
}

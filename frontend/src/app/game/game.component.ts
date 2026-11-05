import { VoteDialogComponent } from './dialogs/vote-dialog/vote-dialog.component';
import { Role } from './../interfaces/role';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WerewolfGame } from '../interfaces/werewolf-game';
import { GameService } from '../services/game.service';
import { GameSettingsDialogComponent } from './dialogs/game-settings-dialog/game-settings-dialog.component';
import { RoomInfoDialogComponent } from './dialogs/room-info-dialog/room-info-dialog.component';
import ROLES from 'src/app/data/roles.json';
import { YourTurnDialogComponent } from './dialogs/your-turn-dialog/your-turn-dialog.component';

import { SHARED_IMPORTS } from '../shared-imports';

@Component({
  standalone: true,
  imports: [...SHARED_IMPORTS],
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit, OnDestroy {
  get game(): WerewolfGame | undefined {
    return this.gameService.game;
  }
  private unsubGame?: () => void;
  private unloading = false;

  constructor(
    public gameService: GameService,
    private cdr: ChangeDetectorRef,
    private roomInfoDialog: MatDialog,
    private gameSettingsDialog: MatDialog,
    private yourTurnDialog: MatDialog,
    private voteDialog: MatDialog,
  ) {
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.unloading = true;
      });
    }
  }

  ngOnInit(): void {
    this.unsubGame = this.gameService.subscribe({
      onGameChange: this.updateGame,
      onYourTurn: this.yourTurn,
      onRoundEnd: this.openVoteDialog,
      onGameStart: this.onGameStart,
    });
    if (!this.game) {
      this.gameService.rejoin();
    }
  }
  ngOnDestroy(): void {
    this.unsubGame?.();
    if (!this.unloading) {
      this.gameService.leave();
    }
    this.roomInfoDialog.closeAll();
    this.gameSettingsDialog.closeAll();
    this.yourTurnDialog.closeAll();
    this.voteDialog.closeAll();
  }

  yourTurn = (roundId?: number): void => {
    this.yourTurnDialog.open(YourTurnDialogComponent, {
      data: {
        role: this.gameService.getOwnRole(),
        game: this.game,
        roundId: roundId ?? this.gameService.currentRoundId,
      },
    });
  };

  rooted(length: number = 4): number {
    return Math.sqrt(length);
  }

  updateGame = (_newGame: WerewolfGame) => {
    this.cdr.detectChanges();
  };

  onGameStart = (): void => {
    this.yourTurnDialog.closeAll();
    this.voteDialog.closeAll();
    this.cdr.detectChanges();
  };

  openSettings() {
    this.gameSettingsDialog.open(GameSettingsDialogComponent, {
      data: { selectedRoles: this.game?.roles, roles: ROLES },
      width: '80vw',
    });
  }

  openRoomInfo() {
    this.roomInfoDialog.open(RoomInfoDialogComponent, {
      data: { roomCode: this.game?.roomCode },
    });
  }

  getMiddleRoleAtIndex(index: number): Role | undefined {
    if (!this.game?.middleRoles) return undefined;
    return this.game?.middleRoles[index];
  }

  openVoteDialog = () => {
    this.voteDialog.open(VoteDialogComponent, {
      data: { game: this.game },
    });
  };

  numberOfRolesIsOk() {
    return (
      (this.game?.roles?.length || 0) ===
      (this.game?.playerList.length || 0) + 2
    );
  }
}

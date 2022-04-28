import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatListOption } from '@angular/material/list';
import { Role } from 'src/app/interfaces/role';
import { WerewolfGame } from 'src/app/interfaces/werewolf-game';

@Component({
  selector: 'app-game-settings-dialog',
  templateUrl: './game-settings-dialog.component.html',
  styleUrls: ['./game-settings-dialog.component.scss']
})
export class GameSettingsDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<GameSettingsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {game:WerewolfGame, roles:Role[]},

  ) { }

  ngOnInit(): void {}

  setRoles(roles: MatListOption[]) {
    console.warn(roles)
  }

  startGame() {
    // TODO: start the game
  }

}

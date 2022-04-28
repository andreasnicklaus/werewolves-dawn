import { BooleanInput } from '@angular/cdk/coercion';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Role } from 'src/app/interfaces/role';
import { GameService } from "../../../services/game.service";

@Component({
  selector: 'app-game-settings-dialog',
  templateUrl: './game-settings-dialog.component.html',
  styleUrls: ['./game-settings-dialog.component.scss']
})
export class GameSettingsDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<GameSettingsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { roles: Role[], selectedRoles: Role[] },
    public gameService: GameService
  ) { }

  ngOnInit(): void {}

  roleIsSelected(role: Role): BooleanInput {
    if (!this.data.selectedRoles) return false
    return this.data.selectedRoles.some(sRole => sRole.name === role.name)
  }

  setRoles() {
    this.gameService.setupRoles(this.data.selectedRoles)
  }

  startGame() {
    this.gameService.startGame()
    this.dialogRef.close()
  }

  roleNumberIsOk() {
    return (this.data.selectedRoles?.length || 0) === ((this.gameService.game?.playerList.length || 0) + 2)
  }

}

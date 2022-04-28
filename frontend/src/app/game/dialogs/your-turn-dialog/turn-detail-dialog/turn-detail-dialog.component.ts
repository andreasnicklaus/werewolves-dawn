import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Role} from "../../../../interfaces/role";
import {WerewolfGame} from "../../../../interfaces/werewolf-game";

@Component({
  selector: 'app-turn-detail-dialog',
  templateUrl: './turn-detail-dialog.component.html',
  styleUrls: ['./turn-detail-dialog.component.scss']
})
export class TurnDetailDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<TurnDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {role:Role, game:WerewolfGame},
  ) { }

  ngOnInit(): void {
  }

}

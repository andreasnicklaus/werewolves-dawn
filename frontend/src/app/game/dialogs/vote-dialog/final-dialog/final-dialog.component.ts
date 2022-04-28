import { Role } from './../../../../interfaces/role';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-final-dialog',
  templateUrl: './final-dialog.component.html',
  styleUrls: ['./final-dialog.component.scss']
})
export class FinalDialogComponent implements OnInit {
  winnerTeamString: string;

  constructor(
    public dialogRef: MatDialogRef<FinalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {winnerFriendly:Boolean, roleAfterTheRound:Role},
  ) {
    this.winnerTeamString = this.data.winnerFriendly? "Villagers": "Werewolves"
  }

  ngOnInit(): void {
  }

}

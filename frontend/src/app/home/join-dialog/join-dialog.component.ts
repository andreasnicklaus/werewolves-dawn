import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {GameService} from "../../services/game.service";

interface DialogData {
  name: string,
  roomCode: string
}

@Component({
  selector: 'app-join-dialog',
  templateUrl: './join-dialog.component.html',
  styleUrls: ['./join-dialog.component.scss']
})
export class JoinDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<JoinDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private router: Router,
    private gameService:GameService
  ) { }

  ngOnInit(): void {
  }

  closeDialog() :void {
    this.dialogRef.close();
  }

  start():void {
    this.gameService.join(this.data.name, this.data.roomCode)
    this.router.navigate(["/game"])
    this.closeDialog();
  }

}

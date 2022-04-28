import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {GameService} from "../../services/game.service";

interface DialogData {
  name: string;
}

@Component({
  selector: 'app-host-dialog',
  templateUrl: './host-dialog.component.html',
  styleUrls: ['./host-dialog.component.scss']
})
export class HostDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<HostDialogComponent>,
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
    this.gameService.join(this.data.name)
    this.router.navigate(["/game"])
    this.closeDialog();
  }

}

import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

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
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit(): void {
  }

  closeDialog() :void {
    this.dialogRef.close();
  }

  start():void {
    console.log("START");
    // TODO: Initialize the game and route to /game
    this.closeDialog();
  }

}

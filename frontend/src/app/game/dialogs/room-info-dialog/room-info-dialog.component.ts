import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-room-info-dialog',
  templateUrl: './room-info-dialog.component.html',
  styleUrls: ['./room-info-dialog.component.scss']
})
export class RoomInfoDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<RoomInfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {roomCode:string},
    private ms:MessageService
  ) { }

  ngOnInit(): void {}

  sendCopiedMessage() {
    if (this.data.roomCode) this.ms.addMessage("Copied to clipboard")
    else this.ms.addMessage("Cannot copy. Roomcode not defined")

    this.dialogRef.close()
  }

}

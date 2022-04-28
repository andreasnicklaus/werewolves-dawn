import { Component, OnInit } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {HostDialogComponent} from "./host-dialog/host-dialog.component";
import {JoinDialogComponent} from "./join-dialog/join-dialog.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  name: string = "";
  roomCode: string = "";

  constructor(private hostDialog: MatDialog, private joinDialog: MatDialog) { }

  ngOnInit(): void {
  }

  openHost() {
    this.hostDialog.open(HostDialogComponent, {
      data: {name: this.name}
    })
  }

  openJoin() {
    this.joinDialog.open(JoinDialogComponent, {
      data: {name: this.name, roomCode: this.roomCode}
    })
  }
}

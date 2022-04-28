import { Component, OnInit } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {HostDialogComponent} from "./host-dialog/host-dialog.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  name: string = "";

  constructor(private hostDialog: MatDialog) { }

  ngOnInit(): void {
  }

  openHost() {
    this.hostDialog.open(HostDialogComponent, {
      data: {name: this.name}
    })
  }

}

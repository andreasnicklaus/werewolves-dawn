import { Component } from '@angular/core';
import {MessageService} from "./services/message.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {InstructionDialogComponent} from "./instruction-dialog/instruction-dialog.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Werewolves - Dawn';

  constructor(
    private messageService: MessageService,
    private _snackBar: MatSnackBar,
    private instructionDialog:MatDialog) {
    messageService.subscribe({onMessage: this.handleMessage})
  }

  private handleMessage = (msg: string, mode:"warn"|undefined) => {
    this.openSnackBar(msg, mode)
  }

  openSnackBar = (message:string, mode:"warn"|undefined, action?:string) => {
    this._snackBar.open(message, action, {
      duration: 6000,
      // verticalPosition: "top",
      panelClass: [mode === "warn"? 'mat-primary': "mat-warn"]
    })
  }

  openInstructionDialog() {
    this.instructionDialog.open(InstructionDialogComponent, {
      height: '80vh'
    })
  }
}

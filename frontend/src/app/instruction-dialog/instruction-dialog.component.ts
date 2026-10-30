import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { SHARED_IMPORTS } from '../shared-imports';
import { InstructionsComponent } from '../instructions/instructions.component';

@Component({
  standalone: true,
  imports: [...SHARED_IMPORTS, InstructionsComponent],
  selector: 'app-instruction-dialog',
  templateUrl: './instruction-dialog.component.html',
  styleUrls: ['./instruction-dialog.component.scss'],
})
export class InstructionDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<InstructionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {},
  ) {}

  ngOnInit(): void {}
}

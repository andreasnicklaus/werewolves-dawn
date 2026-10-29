import { CommonModule } from '@angular/common';
import { NgModule, Provider } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef, MatDialogState } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterTestingModule } from '@angular/router/testing';
import { GameService } from '../app/services/game.service';
import { MessageService } from '../app/services/message.service';

const testImports = [
  CommonModule,
  FormsModule,
  NoopAnimationsModule,
  RouterTestingModule,
  MatBadgeModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatChipsModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
];

@NgModule({
  imports: testImports,
  exports: testImports,
})
export class AppTestingModule {}

export function dialogTestingProviders(data: unknown): Provider[] {
  return [
    { provide: MAT_DIALOG_DATA, useValue: data },
    {
      provide: MatDialogRef,
      useValue: {
        close: jasmine.createSpy('close'),
        getState: () => MatDialogState.OPEN,
      },
    },
  ];
}

export function gameServiceTestingProvider(): Provider {
  return {
    provide: GameService,
    useValue: {
      game: undefined,
      myName: undefined,
      subscribe: jasmine.createSpy('subscribe'),
      unsubscribe: jasmine.createSpy('unsubscribe'),
      leave: jasmine.createSpy('leave'),
      startGame: jasmine.createSpy('startGame'),
      setupRoles: jasmine.createSpy('setupRoles'),
      getOwnRole: jasmine.createSpy('getOwnRole'),
      getOwnPlayerInfo: jasmine.createSpy('getOwnPlayerInfo').and.returnValue(undefined),
    },
  };
}

export function messageServiceTestingProvider(): Provider {
  return {
    provide: MessageService,
    useValue: {
      subscribe: jasmine.createSpy('subscribe'),
      addMessage: jasmine.createSpy('addMessage'),
    },
  };
}
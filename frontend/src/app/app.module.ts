import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatDividerModule} from "@angular/material/divider";
import {MatListModule} from "@angular/material/list";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {HomeComponent} from './home/home.component';
import {GameComponent} from './game/game.component';
import {InstructionsComponent} from './instructions/instructions.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatGridListModule} from "@angular/material/grid-list";
import {HostDialogComponent} from './home/host-dialog/host-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import {JoinDialogComponent} from './home/join-dialog/join-dialog.component';
import {MatTabsModule} from "@angular/material/tabs";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatTableModule} from "@angular/material/table";
import {MatChipsModule} from "@angular/material/chips";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {ClipboardModule} from '@angular/cdk/clipboard';
import { RoomInfoDialogComponent } from './game/dialogs/room-info-dialog/room-info-dialog.component';
import { GameSettingsDialogComponent } from './game/dialogs/game-settings-dialog/game-settings-dialog.component';
import {MatTooltipModule} from "@angular/material/tooltip";
import { InstructionDialogComponent } from './instruction-dialog/instruction-dialog.component';
import { YourTurnDialogComponent } from './game/dialogs/your-turn-dialog/your-turn-dialog.component';
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import { TurnDetailDialogComponent } from './game/dialogs/your-turn-dialog/turn-detail-dialog/turn-detail-dialog.component';
import { VoteDialogComponent } from './game/dialogs/vote-dialog/vote-dialog.component';
import { FinalDialogComponent } from './game/dialogs/vote-dialog/final-dialog/final-dialog.component';
import {MatBadgeModule} from '@angular/material/badge'

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GameComponent,
    InstructionsComponent,
    HostDialogComponent,
    JoinDialogComponent,
    RoomInfoDialogComponent,
    GameSettingsDialogComponent,
    InstructionDialogComponent,
    YourTurnDialogComponent,
    TurnDetailDialogComponent,
    VoteDialogComponent,
    FinalDialogComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatDividerModule,
        MatListModule,
        MatSnackBarModule,
        MatToolbarModule,
        MatGridListModule,
        MatDialogModule,
        MatTabsModule,
        MatExpansionModule,
        MatTableModule,
        MatChipsModule,
        MatProgressSpinnerModule,
        ClipboardModule,
        MatTooltipModule,
        MatButtonToggleModule,
        MatBadgeModule,
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HostDialogComponent } from './host-dialog/host-dialog.component';
import { JoinDialogComponent } from './join-dialog/join-dialog.component';

import { SHARED_IMPORTS } from '../shared-imports';
import ROLES from 'src/app/data/roles.json';
import { SCENARIOS, Scenario } from 'src/app/data/scenarios';

@Component({
  standalone: true,
  imports: [...SHARED_IMPORTS],
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  name: string = '';
  roomCode: string = '';

  roles = ROLES;
  scenarios: Scenario[] = SCENARIOS.slice(0, 3);

  featuredRoleNames = [
    'Werewolf',
    'Alpha wolf',
    'Seeing wolf',
    'Warden',
    'Witch',
    'Young seer',
    'Ghost buster',
    'Idiot',
    'Fortune teller',
    'Scout',
  ];

  get featuredRoles() {
    return this.featuredRoleNames
      .map((name) =>
        this.roles.find((role: { name: string }) => role.name === name),
      )
      .filter((role): role is NonNullable<typeof role> => !!role);
  }

  teamLabel(role: { friendly?: boolean }): string {
    return role.friendly ? 'Villager' : 'Werewolf';
  }

  constructor(
    private hostDialog: MatDialog,
    private joinDialog: MatDialog,
  ) {}

  ngOnInit(): void {}

  openHost() {
    this.hostDialog.open(HostDialogComponent, {
      data: { name: this.name },
    });
  }

  openJoin() {
    this.joinDialog.open(JoinDialogComponent, {
      data: { name: this.name, roomCode: this.roomCode },
    });
  }
}

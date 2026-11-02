import { Component, OnInit } from '@angular/core';
import ROLES from 'src/app/data/roles.json';
import { SCENARIOS, Scenario } from 'src/app/data/scenarios';

import { SHARED_IMPORTS } from '../shared-imports';

@Component({
  standalone: true,
  imports: [...SHARED_IMPORTS],
  selector: 'app-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.scss'],
})
export class InstructionsComponent implements OnInit {
  roles = ROLES;
  scenarios: Scenario[] = SCENARIOS;

  get sortedRoles() {
    return [...this.roles].sort((a: { friendly?: boolean }, b: { friendly?: boolean }) =>
      a.friendly === b.friendly ? 0 : a.friendly ? -1 : 1,
    );
  }

  constructor() {}

  ngOnInit(): void {}

  teamLabel(role: { friendly?: boolean }): string {
    return role.friendly ? 'Villager' : 'Werewolf';
  }
}

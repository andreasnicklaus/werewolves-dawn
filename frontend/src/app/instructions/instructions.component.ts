import { Component, OnInit } from '@angular/core';
import ROLES from 'src/app/data/roles.json';
@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.scss']
})
export class InstructionsComponent implements OnInit {
  roles = ROLES;

  scenarios = [
    {name: "A new dawn", players: '3-6', roles: 'Werewolf, Seeing wolf, Scout, Witch, Young Seer, Villager + Warden + Villager + Sleeping wolf'},
    {name: "Night of werewolves", players: '5-10', roles: 'Villager, Seeing Wolf, Alpha wolf, Warden, Young seer, Scout, Witch, Fortune teller + Bodyguard + Ghost buster + Curator + Sleeping wolf + Prince'},
    {name: "A fearsome opponent", players: '3-4', roles: 'Alpha wolf, Witch, Idiot, Young Seer, Warden, Bodyguard + Scout'},
    {name: "Unsteady alliances", players: '3-7', roles: 'Alpha wolf, Witch, Curator, Ghost buster, Scout, Idiot + Fortune teller + Warden + Young Seer + Seeing wolf'},
    {name: "Anarchy", players: '3-10', roles: 'Randomly take 3 role cards + 1 cards per player (take maximum 3 werewolf cards)'}
  ]

  constructor() { }

  ngOnInit(): void {
  }

}

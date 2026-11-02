export interface Scenario {
  name: string;
  players: string;
  roles: string;
}

export const SCENARIOS: Scenario[] = [
  {
    name: 'A new dawn',
    players: '3-6',
    roles:
      'Werewolf, Seeing wolf, Scout, Witch, Young Seer, Villager + Warden + Villager + Sleeping wolf',
  },
  {
    name: 'Night of werewolves',
    players: '5-10',
    roles:
      'Villager, Seeing Wolf, Alpha wolf, Warden, Young seer, Scout, Witch, Fortune teller + Bodyguard + Ghost buster + Curator + Sleeping wolf + Prince',
  },
  {
    name: 'A fearsome opponent',
    players: '3-4',
    roles: 'Alpha wolf, Witch, Idiot, Young Seer, Warden, Bodyguard + Scout',
  },
  {
    name: 'Unsteady alliances',
    players: '3-7',
    roles:
      'Alpha wolf, Witch, Curator, Ghost buster, Scout, Idiot + Fortune teller + Warden + Young Seer + Seeing wolf',
  },
  {
    name: 'Anarchy',
    players: '3-10',
    roles:
      'Randomly take 3 role cards + 1 card per player (take at most 3 werewolf cards)',
  },
];

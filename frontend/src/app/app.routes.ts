import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'game',
    loadComponent: () =>
      import('./game/game.component').then((m) => m.GameComponent),
  },
  {
    path: 'instructions',
    loadComponent: () =>
      import('./instructions/instructions.component').then(
        (m) => m.InstructionsComponent,
      ),
  },
];

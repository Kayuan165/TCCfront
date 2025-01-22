import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'create',
    loadComponent: () =>
      import('./features/user/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: '',
    redirectTo: 'create',
    pathMatch: 'full',
  },
];

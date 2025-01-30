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
    redirectTo: 'edit',
    pathMatch: 'full',
  },
  {
    path: 'edit',
    loadComponent: () =>
      import('./features/user/edit/edit.component').then(
        (m) => m.EditComponent
      ),
  },
];

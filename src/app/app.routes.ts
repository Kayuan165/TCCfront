import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'visitor-list',
    pathMatch: 'full',
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./features/user/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'visitor-list',
    loadComponent: () =>
      import('./features/user/visitor-list/visitor-list.component').then(
        (m) => m.VisitorListComponent
      ),
  },
  {
    path: 'edit',
    loadComponent: () =>
      import('./features/user/edit/edit.component').then(
        (m) => m.EditComponent
      ),
  },
];

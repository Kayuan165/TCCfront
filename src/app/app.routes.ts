import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./features/user/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'visitor',
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

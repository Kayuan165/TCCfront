import { provideClientHydration } from '@angular/platform-browser';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'create-visitor',
    loadComponent: () =>
      import('./features/user/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'visitors',
    loadComponent: () =>
      import('./features/user/visitor-list/visitor-list.component').then(
        (m) => m.VisitorListComponent
      ),
  },
  {
    path: 'edit-visitor',
    loadComponent: () =>
      import('./features/user/edit/edit.component').then(
        (m) => m.EditComponent
      ),
    providers: [provideClientHydration()],
  },
  {
    path: 'residents',
    loadComponent: () =>
      import('./features/resident/resident-list/resident-list.component').then(
        (m) => m.ResidentListComponent
      ),
  },
  {
    path: 'create-resident',
    loadComponent: () =>
      import(
        './features/resident/resident-register/resident-register.component'
      ).then((m) => m.ResidentRegisterComponent),
  },
  {
    path: 'edit-resident',
    loadComponent: () =>
      import('./features/resident/resident-edit/resident-edit.component').then(
        (m) => m.ResidentEditComponent
      ),
    providers: [provideClientHydration()],
  },
  {
    path: 'attendance',
    loadComponent: () =>
      import(
        './features/attendance/attendance-list/attendance-list.component'
      ).then((m) => m.AttendanceListComponent),
  },
];

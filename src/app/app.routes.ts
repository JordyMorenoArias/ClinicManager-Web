import { Routes } from '@angular/router';
import { MainLayout } from './layouts/main-layout/main-layout';
import { BlankLayout } from './layouts/blank-layout/blank-layout';
import { Login } from './features/auth/pages/login/login';
import { AppointmentList } from './features/appointment/pages/appointment-list/appointment-list';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    canActivateChild: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: AppointmentList,
      },
    ],
  },
  {
    path: 'auth',
    component: BlankLayout,
    children: [{ path: 'login', component: Login }],
  },
];

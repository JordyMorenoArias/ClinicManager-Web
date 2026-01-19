import { Routes } from '@angular/router';
import { MainLayout } from './layouts/main-layout/main-layout';
import { BlankLayout } from './layouts/blank-layout/blank-layout';
import { Login } from './features/auth/pages/login/login';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [],
  },
  {
    path: 'auth',
    component: BlankLayout,
    children: [{ path: 'login', component: Login }],
  },
];

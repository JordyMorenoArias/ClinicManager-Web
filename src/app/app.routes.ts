import { Routes } from '@angular/router';
import { MainLayout } from './layouts/main-layout/main-layout';
import { BlankLayout } from './layouts/blank-layout/blank-layout';
import { Login } from './features/auth/pages/login/login';
import { AppointmentList } from './features/appointment/pages/appointment-list/appointment-list';
import { authGuard } from './core/guards/auth-guard';
import { AddAppointment } from './features/appointment/pages/add-appointment/add-appointment';
import { UpdateAppointment } from './features/appointment/pages/update-appointment/update-appointment';
import { PatientList } from './features/patient/pages/patient-list/patient-list';
import { AddPatient } from './features/patient/pages/add-patient/add-patient';

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
      {
        path: 'appointments',
        component: AddAppointment,
      },
      {
        path: 'appointments/:id',
        component: UpdateAppointment,
      },
      {
        path: 'patients',
        component: PatientList,
      },
      {
        path: 'patients/add',
        component: AddPatient,
      },
    ],
  },
  {
    path: 'auth',
    component: BlankLayout,
    children: [{ path: 'login', component: Login }],
  },
];

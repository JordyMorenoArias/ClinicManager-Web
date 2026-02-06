import { Pipe, PipeTransform } from '@angular/core';
import { AppointmentStatusEnum } from '../enums/appointment-status.enum';

@Pipe({
  name: 'appointmentStatus',
})
export class AppointmentStatusPipe implements PipeTransform {
  transform(value: AppointmentStatusEnum, ...args: unknown[]): string {
    return AppointmentStatusEnum[value] ?? 'Unknown';
  }
}

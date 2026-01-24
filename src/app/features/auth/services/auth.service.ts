import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthLoginDTO } from '../dtos/auth-login.dto';
import { Observable } from 'rxjs';
import { UserDTO } from '../dtos/user.dto';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http: HttpClient = inject(HttpClient);
  private apiUrl: string = environment.apiUrl;

  public login(data: AuthLoginDTO): Observable<HttpResponse<UserDTO>> {
    return this.http.post<UserDTO>(`${this.apiUrl}/auth/login`, data, { observe: 'response' });
  }
}

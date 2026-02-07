import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthLoginDTO } from '../dtos/auth-login.dto';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { User } from '../../user/models/user.model';
import { UserMapper } from '../../user/mappers/user.mapper';
import { AuthLoginResponseDTO } from '../dtos/auth-login-response.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http: HttpClient = inject(HttpClient);
  private apiUrl: string = environment.apiUrl;

  public login(data: AuthLoginDTO): Observable<HttpResponse<User>> {
    return this.http
      .post<AuthLoginResponseDTO>(`${this.apiUrl}/auth/login`, data, {
        observe: 'response',
        withCredentials: true,
      })
      .pipe(
        map((response: HttpResponse<AuthLoginResponseDTO>) => {
          if (!response.body) {
            throw new Error('Login response body is null');
          }
          return response.clone({
            body: UserMapper.fromDTO(response.body.user),
          });
        }),
      );
  }

  public isLoggedIn(): Observable<boolean> {
    return this.http.get(`${this.apiUrl}/auth/me`, { withCredentials: true }).pipe(
      map(() => true),
      catchError(() => [false]),
    );
  }
}

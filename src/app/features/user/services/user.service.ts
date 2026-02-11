import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { map, Observable } from 'rxjs';
import { PagedResultDTO } from '../../../shared/dtos/paged-result.dto';
import { User } from '../models/user.model';
import { UserDTO } from '../dtos/user.dto';
import { UserMapper } from '../mappers/user.mapper';
import { UserQueryParametersDTO } from '../dtos/user-query-parameters.dto';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getUsers(queryParams: UserQueryParametersDTO): Observable<HttpResponse<PagedResultDTO<User>>> {
    return this.http
      .get<PagedResultDTO<UserDTO>>(this.apiUrl + '/user', {
        params: queryParams as any,
        observe: 'response',
        withCredentials: true,
      })
      .pipe(
        map((response: HttpResponse<PagedResultDTO<UserDTO>>) => {
          if (!response.body) {
            throw new Error('Login response body is null');
          }

          // Map each UserDTO to User
          const mappedBody: PagedResultDTO<User> = {
            ...response.body,
            items: response.body.items.map((item) => UserMapper.fromDTO(item)),
          };
          return response.clone({ body: mappedBody });
        }),
      );
  }
}

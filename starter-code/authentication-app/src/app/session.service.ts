import { Injectable } from '@angular/core';
import { Http, Response} from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { environment } from '../environments/environment';

export interface User{
  _id:string,
  username:string,
  name:string,
  secret:string,
  updated_at:Date,
  created_at:Date
}

@Injectable()
export class SessionService {
  user: User; // The current logged in user
  BASE_URL: string = `${environment.BASE_URL}/api/auth`;
  options:Object = {withCredentials:true};

  constructor(private http: Http) { }
  handleError(e) {
    console.error("Error en la llamada a la API");
    return Observable.throw(e.json().message);
  }

  signup(username: string, password: string): Observable<User> {
    return this.http.post(`${this.BASE_URL}/signup`, { username, password }, this.options)
      .map(res => res.json())
      .catch(this.handleError);
  }

  login(username: string, password: string): Observable<User> {
    return this.http.post(`${this.BASE_URL}/login`, { username, password }, this.options)
      .map(res => {
        this.user = res.json();
        return this.user;
      })
      .catch(this.handleError);
  }

  logout(): Observable<Object> {
    return this.http.get(`${this.BASE_URL}/logout`)
      .map(res => {
        res.json();
        this.user = undefined;
      })
      .catch(this.handleError);
  }

  isLoggedIn(): Observable<User> {
    return this.http.get(`${this.BASE_URL}/loggedin`, this.options)
      .map(res => {
        this.user = res.json();
        return this.user;
      })
      .catch(this.handleError);
  }
}

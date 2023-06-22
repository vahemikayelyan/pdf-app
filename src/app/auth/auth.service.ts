import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserData } from '../login/login.component';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly logInProvider$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {
    this.logInProvider$.next(this.isLoggedIn);
  }

  get isLoggedIn(): boolean {
    return !!this.userDetails.token;
  }

  set userDetails(data: UserDetails) {
    for (const [key, value] of Object.entries(data)) {
      localStorage.setItem(key, value!);
    }
  }

  get userDetails(): UserDetails {
    const data: UserDetails = { email: '', name: '', token: '' };

    Object.keys(data).forEach((key) => {
      data[key] = localStorage.getItem(key);
    });

    return data;
  }

  loginUser(_data: UserData): Observable<AuthResponse> {
    return this.http.get<AuthResponse>('assets/mockdata/auth-data.json');
  }

  logOutUser(): void {
    localStorage.clear();
    this.logInProvider$.next(false);
    this.router.navigateByUrl('');
  }
}

export interface APIResponse {
  result: string;
  message?: string;
}

export interface UserDetails extends IObjectKeys {
  name: string;
  email: string;
  token: string;
}

export interface AuthResponse extends APIResponse {
  data: UserDetails;
}

interface IObjectKeys {
  [key: string]: string | null;
}

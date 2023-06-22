import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { RoutePaths } from '../app-routing.module';
import { AuthService } from '../auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [ReactiveFormsModule],
})
export class LoginComponent {
  isInProcess: boolean = false;
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private router: Router, private authService: AuthService) {}

  onSubmit() {
    if (this.loginForm.valid) {
      this.isInProcess = true;
      const data: UserData = {
        email: this.loginForm.controls.email.value!,
        password: this.loginForm.controls.password.value!,
      };
      this.authService.loginUser(data).subscribe({
        next: (response) => {
          if (response.result === 'OK') {
            this.authService.userDetails = response.data;
            this.router.navigateByUrl(RoutePaths.news);
            this.authService.logInProvider$.next(true);
          }
        },
        error: () => {
          this.isInProcess = false;
        },
      });
    }
  }
}

export interface UserData {
  email: string;
  password: string;
}

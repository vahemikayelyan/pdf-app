import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { SnackBarService } from '../shared/components/snack-bar/snack-bar.service';
import { APIResponse, AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
  private apiResponse?: APIResponse;

  constructor(
    private authService: AuthService,
    private snackBarService: SnackBarService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.authService.isLoggedIn) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${this.authService.userDetails.token}`,
        },
      });
    }

    return next.handle(req).pipe(
      tap((response) => {
        if (response instanceof HttpResponse) {
          this.apiResponse = response.body as APIResponse;
        }
      }),
      finalize(() => {
        if (this.apiResponse?.result !== 'OK') {
        }
      }),
      catchError((error: HttpErrorResponse) => {
        this.openErrorSnackBar(error);
        return throwError(() => error);
      })
    );
  }

  openErrorSnackBar(error: HttpErrorResponse) {
    this.snackBarService.open({
      title: 'Error - ' + error.statusText,
      message: error.message,
    });
  }
}

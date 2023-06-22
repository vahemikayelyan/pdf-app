import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { RouteData, RoutePaths } from '../app-routing.module';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const isLoggedIn = this.authService.isLoggedIn;

    if ((route.data as RouteData).protected) {
      if (isLoggedIn) {
        return true;
      }

      this.router.navigate([RoutePaths.login], {
        queryParams: { redirectURL: state.url },
      });

      return false;
    } else {
      if (!isLoggedIn) {
        return true;
      }

      this.router.navigateByUrl('/');

      return false;
    }
  }
}

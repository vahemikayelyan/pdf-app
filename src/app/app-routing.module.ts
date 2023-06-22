import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

export enum RoutePaths {
  home = '',
  news = 'news',
  about = 'about',
  contact = 'contact',
  login = 'login',
  logout = 'logout',
}

export interface RouteData {
  label: string;
  exact?: boolean;
  right?: boolean;
  protected?: boolean;
}

export const APP_ROUTES: Routes = [
  {
    path: RoutePaths.home,
    data: { label: 'Home', exact: true },
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: RoutePaths.contact,
    canActivate: [AuthGuard],
    data: { protected: false, label: 'Contact' } as RouteData,
    loadComponent: () =>
      import('./contact/contact.component').then((m) => m.ContactComponent),
  },
  {
    path: RoutePaths.news,
    canActivate: [AuthGuard],
    data: { protected: true, label: 'News' } as RouteData,
    loadComponent: () =>
      import('./news/news.component').then((m) => m.NewsComponent),
  },
  {
    path: RoutePaths.about,
    canActivate: [AuthGuard],
    data: { protected: true, label: 'About' } as RouteData,
    loadComponent: () =>
      import('./about/about.component').then((m) => m.AboutComponent),
  },
  {
    path: RoutePaths.login,
    canActivate: [AuthGuard],
    data: { protected: false, right: true, label: 'Login' } as RouteData,
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(APP_ROUTES)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

import { Component, OnInit } from '@angular/core';
import { APP_ROUTES, RouteData, RoutePaths } from '../app-routing.module';
import { AuthService, UserDetails } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  navBarItems: NavItem[] = [];
  navBarOpen: boolean = false;
  userDetails?: UserDetails;
  openNavItem?: NavItem;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.logInProvider$.subscribe((value) => {
      this.userDetails = this.authService.userDetails;
      this.setNavBarItems(value);
    });
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  setNavBarItems(isLoggedIn: boolean) {
    this.navBarItems = [];
    APP_ROUTES.forEach((route) => {
      const data: RouteData = route.data as RouteData;

      if (data.protected === undefined || data.protected === isLoggedIn) {
        this.navBarItems.push({ ...data, path: route.path });
      }
    });

    if (isLoggedIn) {
      this.navBarItems.push(
        {
          parent: true,
          protected: true,
          label: 'Calendar',
          children: [
            { label: 'User profile' },
            {
              label: 'Settings',
              children: [
                { label: 'Child 1' },
                {
                  label: 'Child 2',
                  children: [{ label: 'Child 1' }, { label: 'Child 2' }],
                },
              ],
            },
          ],
        },
        {
          right: true,
          parent: true,
          protected: true,
          label: this.userDetails?.name!,
          children: [
            { label: 'User profile' },
            {
              label: 'Settings',
              children: [
                { label: 'Child 1' },
                {
                  label: 'Child 2',
                  children: [{ label: 'Child 1' }, { label: 'Child 2' }],
                },
              ],
            },
            { label: 'Log out', path: RoutePaths.logout },
          ],
        }
      );
    }
  }

  logOut() {
    this.authService.logOutUser();
    this.navBarOpen = false;
  }

  selectNavItem(item?: NavItem) {
    this.collapseNavItems(this.navBarItems);
    if (item?.path === RoutePaths.logout) {
      this.logOut();
    }
  }

  collapseNavItems(navItems: NavItem[]) {
    for (let navItem of navItems) {
      if (navItem.children && navItem.open) {
        this.collapseNavItems(navItem.children);
        navItem.open = false;
      }
    }
  }

  toggleChildItems(navItem: NavItem) {
    if (navItem.parent) {
      if (this.openNavItem) {
        if (this.openNavItem !== navItem) {
          this.openNavItem.open = false;
        }
        this.collapseNavItems(this.openNavItem.children!);
      }
      this.openNavItem = navItem;
    }
    navItem.open = !navItem.open;
  }
}

interface NavItem extends RouteData {
  path?: string;
  open?: boolean;
  parent?: boolean;
  children?: NavItem[];
}

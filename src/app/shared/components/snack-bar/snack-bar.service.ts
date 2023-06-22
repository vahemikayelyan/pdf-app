import {
  ApplicationRef,
  ComponentRef,
  Injectable,
  createComponent,
} from '@angular/core';
import { SnackBarComponent } from './snack-bar.component';

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  private componentRef?: ComponentRef<SnackBarComponent>;

  constructor(private appRef: ApplicationRef) {}

  open({
    title,
    message,
    duration,
  }: {
    title?: string;
    message?: string;
    duration?: number;
  }) {
    this.clear();
    this.componentRef = createComponent(SnackBarComponent, {
      environmentInjector: this.appRef.injector,
    });
    this.componentRef.instance.title = title;
    this.componentRef.instance.message = message;
    this.appRef.attachView(this.componentRef.hostView);
    document.body.appendChild(this.componentRef.location.nativeElement);

    if (duration) {
      setTimeout(() => {
        this.componentRef?.instance.close();
      }, duration);
    }
  }

  clear() {
    if (this.componentRef) {
      this.appRef.detachView(this.componentRef.hostView);
      this.componentRef.destroy();
    }
  }
}

import { Component, Input } from '@angular/core';
import { SnackBarService } from './snack-bar.service';

@Component({
  selector: 'snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.css'],
})
export class SnackBarComponent {
  @Input() title?: string;
  @Input() message?: string;
  closed: boolean = false;

  constructor(private snackBarService: SnackBarService) {}

  close() {
    this.closed = true;
  }

  animationDone(event: AnimationEvent) {
    if (event.animationName.includes('snackbarOut')) {
      this.snackBarService.clear();
    }
  }
}

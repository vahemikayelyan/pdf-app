import { Component } from '@angular/core';
import { SnackBarService } from '../shared/components/snack-bar/snack-bar.service';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  constructor(private snackBarService: SnackBarService) {}

  open() {
    this.snackBarService.open({ title: 'Error', message: 'Bad request 403!' });
  }
}

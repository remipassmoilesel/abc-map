import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from './lib/authentication/authentication.service';

@Component({
  selector: 'abc-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private authentication: AuthenticationService) {
  }

  ngOnInit(): void {
  }
}

import { Component, OnInit } from '@angular/core';
import {Store} from '@ngrx/store';
import {IMainState} from '../../store';

@Component({
  selector: 'abc-right-menu',
  templateUrl: './right-menu.component.html',
  styleUrls: ['./right-menu.component.scss']
})
export class RightMenuComponent implements OnInit {

  constructor(private store: Store<IMainState>) { }

  ngOnInit() {

  }

  onColorChanged($event: string) {
    console.log($event);
  }
}

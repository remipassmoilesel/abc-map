import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'abc-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent implements OnInit {

  @Output()
  color = new EventEmitter<string>();

  selectedColor: string = 'black';

  colorHistory: string[] = [];

  colorPresets = [
    'rgb(255,7,20)',
    'rgb(255,157,36)',
    'rgb(255,245,0)',
    'rgb(65,255,73)',
    'rgb(37,33,236)',
    'rgb(142,10,208)'
  ];

  constructor() { }

  ngOnInit() {
    _.times(this.colorPresets.length, i => this.colorHistory.push('rgb(255,255,255'));
  }

  onPresetSelected(color: string){
    this.selectedColor = color;
    this.emitColor(this.selectedColor);
  }

  onColorChanged(color: string){
    this.emitColor(color);
  }

  emitColor(color: string) {
    this.colorHistory.unshift(color);
    this.colorHistory.pop();
  }
}

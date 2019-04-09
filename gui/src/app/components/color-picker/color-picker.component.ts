import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'abc-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent implements OnInit {

  public colorPresets = [
    'rgb(255,7,20)',
    'rgb(255,157,36)',
    'rgb(255,245,0)',
    'rgb(65,255,73)',
    'rgb(37,33,236)',
    'rgb(142,10,208)'
  ];

  public selectedColor: string = 'black';

  constructor() { }

  ngOnInit() {
  }

  onPresetClick(color: string){
    console.log(color)
    this.selectedColor = color;
  }

}

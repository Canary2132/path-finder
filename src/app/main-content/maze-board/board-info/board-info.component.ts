import { Component, OnInit } from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-board-info',
  templateUrl: './board-info.component.html',
  styleUrls: ['./board-info.component.scss'],
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(
          ':enter',
          [
            style({opacity: 0}),
            animate('0.2s ease-in',
              style({opacity: 1}))
          ]
        ),
        transition(
          ':leave',
          [
            style({opacity: 1}),
            animate('0.2s ease-in',
              style({opacity: 0}))
          ]
        )
      ]
    )
  ]
})
export class BoardInfoComponent implements OnInit {

  showInfoText = false;

  constructor() { }

  ngOnInit(): void {
  }


  toggleInfo(): void {
    this.showInfoText = !this.showInfoText;
  }
}

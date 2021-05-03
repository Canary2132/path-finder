import { Component, OnInit } from '@angular/core';
import {fromEvent} from 'rxjs';
import {animate, keyframes, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger('iconLight', [
      transition('void => *', [
        style({
          transform: 'rotate(-180deg)',
          opacity: 0,
        }),
        animate('0.2s', keyframes([
          style({
            transform: 'rotate(0)',
            opacity: 1,
            offset: 1
          })
        ]))
      ]),
      transition('* => void', [
        animate('0.2s', keyframes([
          style({
            transform: 'rotate(180deg)',
            opacity: 0,
            offset: 1
          })
        ]))
      ])
    ]),
    trigger('iconDark', [
      transition('void => *', [
        style({
          transform: 'rotate(-180deg)',
          opacity: 0,
        }),
        animate('0.2s', keyframes([
          style({
            transform: 'rotate(0)',
            opacity: 1,
            offset: 1
          })
        ]))
      ]),
      transition('* => void', [
        animate('0.2s', keyframes([
          style({
            transform: 'rotate(180deg)',
            opacity: 0,
            offset: 1
          })
        ]))
      ])
    ])
  ]
})
export class HeaderComponent implements OnInit {

  useDarkTheme;

  constructor() { }

  ngOnInit(): void {
    const darkThemePrefers = window.matchMedia('(prefers-color-scheme: dark)');
    this.useDarkTheme = JSON.parse(localStorage.getItem('dark-mode')) ?? darkThemePrefers.matches;

    fromEvent(darkThemePrefers, 'change').subscribe((evt: any) => {
      this.toggleDarkMode(evt.matches);
    });

    this.toggleDarkMode(this.useDarkTheme);
  }

  changeTheme(): void {
    this.useDarkTheme = !this.useDarkTheme;
    localStorage.setItem('dark-mode', this.useDarkTheme);
    this.toggleDarkMode(this.useDarkTheme);
  }

  private toggleDarkMode(state: boolean): void{
    if (state) {
      document.body.classList.add('theme-dark');
    } else {
      document.body.classList.remove('theme-dark');
    }
  }

}

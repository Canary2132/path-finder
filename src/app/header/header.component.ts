import { Component, OnInit } from '@angular/core';
import {fromEvent} from 'rxjs';
import {animate, keyframes, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  useDarkTheme;

  constructor() { }

  ngOnInit(): void {
    const darkThemePrefers = window.matchMedia('(prefers-color-scheme: dark)');
    this.useDarkTheme = !!(localStorage.getItem('dark-mode') ?? darkThemePrefers.matches);

    fromEvent(darkThemePrefers, 'change').subscribe((evt: any) => {
      this.toggleDarkMode(evt.matches);
    });

    this.toggleDarkMode(this.useDarkTheme);
  }

  changeTheme(): void {
    this.useDarkTheme = !this.useDarkTheme;
    // localStorage.setItem('dark-mode', this.useDarkTheme);
    this.toggleDarkMode(this.useDarkTheme);
  }

  private toggleDarkMode(state: boolean): void{
    document.documentElement.classList.toggle('dark-mode', state);
  }

}

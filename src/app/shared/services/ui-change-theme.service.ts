import { Injectable } from '@angular/core';
import {fromEvent} from 'rxjs';

const USE_DARK_MODE_KEY = 'use-dark-mode';
const DARK_THEME_CLASS = 'theme-dark';

@Injectable({
  providedIn: 'root'
})
export class UiChangeThemeService {

  private _isDarkThemeUsed: boolean;

  constructor() {
    const darkThemePrefers = window.matchMedia('(prefers-color-scheme: dark)');
    this._isDarkThemeUsed = JSON.parse(localStorage.getItem(USE_DARK_MODE_KEY)) ?? darkThemePrefers.matches;

    fromEvent(darkThemePrefers, 'change').subscribe((evt: MediaQueryListEvent) => {
      this.toggleDarkMode(evt.matches);
    });

    this.toggleDarkMode(this._isDarkThemeUsed);
  }

  get isDarkThemeUsed(): boolean{
    return this._isDarkThemeUsed;
  }

  changeTheme(): void {
    this._isDarkThemeUsed = !this._isDarkThemeUsed;
    localStorage.setItem(USE_DARK_MODE_KEY, `${this._isDarkThemeUsed}`);
    this.toggleDarkMode(this._isDarkThemeUsed);
  }

  private toggleDarkMode(useDarkTheme: boolean): void{
    if (useDarkTheme) {
      document.body.classList.add(DARK_THEME_CLASS);
    } else {
      document.body.classList.remove(DARK_THEME_CLASS);
    }
  }

}
